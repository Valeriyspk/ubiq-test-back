const rateLimit = require("express-rate-limit");

const { rateLimitWindowMs, rateLimitMax } = require("../config/config");

module.exports = app => {
  app.use(
    rateLimit({
      windowMs: rateLimitWindowMs,
      max: rateLimitMax
    })
  );
};
