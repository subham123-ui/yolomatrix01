"use client"
import React, { useState } from 'react';
import { Device } from '@twilio/voice-sdk';
import axios from 'axios';
import styles from './FloatingCallButton.module.css';

interface FloatingCallButtonProps {
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  phoneNumber?: string; // Optional phone number of the user
}

const FloatingCallButton: React.FC<FloatingCallButtonProps> = ({
  position = 'bottom-right',
  phoneNumber = '',
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [callStatus, setCallStatus] = useState<string>('');
  const [device, setDevice] = useState<Device | null>(null);

  // Function to initialize the Twilio device
  const setupDevice = async () => {
    try {
      // Generate a random identity for this user
      const identity = `user-${Math.random().toString(36).substring(2, 9)}`;
      
      // Get token from your server
      const response = await axios.post('/api/generate-token', { identity });
      const token = response.data.token;
      
      // Initialize the device with the token
      const newDevice = new Device(token, {
        codecPreferences: ['opus', 'pcmu'],
        fakeLocalDTMF: true,
        enableRingingState: true,
      });
      
      // Setup event listeners
      newDevice.on('registered', () => {
        console.log('Device registered');
      });
      
      newDevice.on('error', (error) => {
        console.error('Device error:', error);
        setCallStatus('Error: Could not connect call');
        setIsLoading(false);
      });
      
      newDevice.on('disconnect', () => {
        setCallStatus('Call ended');
        setTimeout(() => setCallStatus(''), 3000);
        setIsLoading(false);
      });
      
      // Register the device for incoming calls
      await newDevice.register();
      
      setDevice(newDevice);
      return newDevice;
    } catch (error) {
      console.error('Error setting up device:', error);
      setCallStatus('Error: Could not set up call');
      setIsLoading(false);
      return null;
    }
  };

  // Function to make a call
  const makeCall = async () => {
    setIsLoading(true);
    setCallStatus('Connecting...');
    
    try {
      // Initialize device if not already done
      const activeDevice = device || await setupDevice();
      if (!activeDevice) {
        throw new Error('Could not set up the calling device');
      }
      
      // Option 1: Make call through the client (using browser WebRTC)
      // const call = await activeDevice.connect({
      //   params: { To: 'owner' } // This identifier will be used in your TwiML
      // });

      // Option 2: Make call through the server
      await axios.post('/api/make-call', {
        userPhoneNumber: phoneNumber || 'Website visitor',
      });
      
      setCallStatus('Call connected!');
    } catch (error) {
      console.error('Error making call:', error);
      setCallStatus('Failed to connect call');
    } finally {
      setIsLoading(false);
      // Reset the status message after a few seconds
      setTimeout(() => setCallStatus(''), 5000);
    }
  };

  return (
    <div className={`${styles.floatingButtonContainer} ${styles[position]}`}>
      {callStatus && (
        <div className={styles.callStatus}>
          {callStatus}
        </div>
      )}
      <button
        className={styles.floatingButton}
        onClick={makeCall}
        disabled={isLoading}
      >
        {isLoading ? (
          <span className={styles.spinner}></span>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
          </svg>
        )}
      </button>
    </div>
  );
};

export default FloatingCallButton;