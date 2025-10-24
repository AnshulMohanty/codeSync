const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { debugCode, explainCode } = require('../controllers/aiController');

// Rate limiting for AI endpoints
const aiRateLimit = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW) || 60000, // 1 minute
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 10, // 10 requests per window
  message: {
    success: false,
    error: 'Rate limit exceeded. Please try again in 60 seconds.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// POST /api/ai/debug - Get AI debugging assistance
router.post('/debug', aiRateLimit, debugCode);

// POST /api/ai/explain - Get code explanation
router.post('/explain', aiRateLimit, explainCode);

module.exports = router;
