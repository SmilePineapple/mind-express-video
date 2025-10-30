module.exports = async function handler(req, res) {
  try {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    // Initialize Pusher inside handler
    const Pusher = require('pusher');
    const pusher = new Pusher({
      appId: process.env.PUSHER_APP_ID,
      key: process.env.PUSHER_KEY,
      secret: process.env.PUSHER_SECRET,
      cluster: process.env.PUSHER_CLUSTER,
      useTLS: true
    });
    const { channel, event, data } = req.body;

    if (!channel || !event || !data) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    await pusher.trigger(channel, event, data);
    
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Pusher trigger error:', error);
    return res.status(500).json({ error: 'Failed to trigger event' });
  }
};
