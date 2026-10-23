const rateLimit = require("express-rate-limit");

function createUserRateLimit({ windowMs, limit, message }) {
  return rateLimit({
    windowMs,
    limit,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    keyGenerator: (req) => req.user?.id || req.ip,
    handler: (req, res) => {
      res.status(429).json({ status: 429, errorCode: "RATE_LIMITED", message });
    },
  });
}

module.exports = { createUserRateLimit };
