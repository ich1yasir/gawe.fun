import { NextApiRequest, NextApiResponse } from 'next';
import { channelManager } from '../../../lib/channelManager';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const stats = channelManager.getChannelStats();
    res.status(200).json(stats);
  } catch (error) {
    console.error('Error getting channel stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
