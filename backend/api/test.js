module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  return res.status(200).json({
    status: 'ok',
    message: 'Test endpoint working!',
    timestamp: new Date().toISOString(),
    env: {
      hasPusherAppId: !!process.env.PUSHER_APP_ID,
      hasPusherKey: !!process.env.PUSHER_KEY,
      hasPusherSecret: !!process.env.PUSHER_SECRET,
      hasPusherCluster: !!process.env.PUSHER_CLUSTER
    }
  });
};
