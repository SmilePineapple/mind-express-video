module.exports = async function handler(req, res) {
  // CRITICAL: Set CORS headers FIRST, before any logic
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Max-Age', '86400');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed', method: req.method });
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
    const { socket_id, channel_name } = req.body;

    // Validate channel name (should be presence-room-{licenseId})
    if (!channel_name || !channel_name.startsWith('presence-room-')) {
      return res.status(400).json({ error: 'Invalid channel name' });
    }

    // Authenticate the user for presence channel
    const presenceData = {
      user_id: socket_id,
      user_info: {
        nickname: req.body.nickname || 'Anonymous'
      }
    };

    const authResponse = pusher.authorizeChannel(socket_id, channel_name, presenceData);
    
    return res.status(200).json(authResponse);
  } catch (error) {
    console.error('Pusher auth error:', error);
    return res.status(500).json({ 
      error: 'Authentication failed',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};
