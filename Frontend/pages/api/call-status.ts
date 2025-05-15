import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Extract status information from the request
    const { CallSid, CallStatus } = req.body;
    
    // Log call status for monitoring
    console.log(`Call ${CallSid} status updated to: ${CallStatus}`);
    
    // You can store this information in a database if needed
    
    // Return success
    res.status(200).send('OK');
  } catch (error) {
    console.error('Error handling call status:', error);
    res.status(500).json({ error: 'Failed to process call status' });
  }
}