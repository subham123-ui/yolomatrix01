import { NextApiRequest, NextApiResponse } from 'next';
import twilio from 'twilio';

// This endpoint generates a Twilio access token for client-side usage
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { identity } = req.body;

    if (!identity) {
      return res.status(400).json({ error: 'Identity is required' });
    }

    // Get environment variables
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const appSid = process.env.TWILIO_TWIML_APP_SID;

    if (!accountSid || !authToken || !appSid) {
      return res.status(500).json({ error: 'Missing Twilio credentials' });
    }

    // Create an access token
    const AccessToken = twilio.jwt.AccessToken;
    const VoiceGrant = AccessToken.VoiceGrant;

    // Create a Voice grant for this token
    const voiceGrant = new VoiceGrant({
      outgoingApplicationSid: appSid,
      incomingAllow: true,
    });

    // Create the access token
    const token = new AccessToken(accountSid, authToken, identity);
    token.addGrant(voiceGrant);

    // Return the token as JSON
    res.status(200).json({
      token: token.toJwt(),
    });
  } catch (error) {
    console.error('Error generating token:', error);
    res.status(500).json({ error: 'Failed to generate token' });
  }
}