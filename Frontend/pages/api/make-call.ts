import { NextApiRequest, NextApiResponse } from 'next';
import twilio from 'twilio';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get Twilio credentials from environment variables
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
    const ownerPhoneNumber = process.env.OWNER_PHONE_NUMBER;

    // Validate environment variables
    if (!accountSid || !authToken || !twilioPhoneNumber || !ownerPhoneNumber) {
      return res.status(500).json({ error: 'Missing Twilio configuration' });
    }

    // Initialize Twilio client
    const client = twilio(accountSid, authToken);

    // Get the user's phone number from the request
    const { userPhoneNumber } = req.body;

    if (!userPhoneNumber) {
      return res.status(400).json({ error: 'User phone number is required' });
    }

    // Create a call using Twilio
    const call = await client.calls.create({
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/twiml`,
      to: ownerPhoneNumber,
      from: twilioPhoneNumber,
      // This will be used in the TwiML response to announce who's calling
      statusCallback: `${process.env.NEXT_PUBLIC_BASE_URL}/api/call-status`,
      statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed'],
      statusCallbackMethod: 'POST',
    });

    // Return the call SID to the client
    res.status(200).json({
      success: true,
      callSid: call.sid,
    });
  } catch (error) {
    console.error('Error making call:', error);
    res.status(500).json({ error: 'Failed to make call' });
  }
}