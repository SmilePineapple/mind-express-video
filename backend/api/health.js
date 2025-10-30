module.exports = async function handler(req, res) {
  try {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    return res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'Mind Express Video Signaling',
      version: '2.0.0',
      pusher: 'enabled'
    });
  } catch (error) {
    console.error('Health check error:', error);
    return res.status(500).json({
      status: 'error',
      message: error.message,
      stack: error.stack
    });
  }
};
