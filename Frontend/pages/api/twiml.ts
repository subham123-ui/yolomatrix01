import { NextApiRequest, NextApiResponse } from 'next';
import twilio from 'twilio';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Create TwiML response
  const twiml = new twilio.twiml.VoiceResponse();
  
  // Add instructions for the call
  twiml.say({
    voice: 'alice',
  }, 'You have a call from your website. Connecting you now.');

  // Set the content type to XML
  res.setHeader('Content-Type', 'text/xml');
  
  // Send the TwiML as a response
  res.send(twiml.toString());
}