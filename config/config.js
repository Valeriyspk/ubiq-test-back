exports.port = 8080;

// websocket idle timeout time
exports.idleTimeoutValue = 600000;

// websocket message max length in bytes
exports.maxPayload = 500;

// cookie max age
exports.maxAge = 24 * 60 * 60 * 1000;

// how long in milliseconds to keep records of requests in memory
exports.rateLimitWindowMs = 15 * 60 * 1000; // 15 minutes

// max number of connections during windowMs milliseconds before sending a 429 response.
exports.rateLimitMax = 100;

// chat message max length
exports.messageMaxLength = 300;

// Time period, after which server will consider that gracefull shutdown is failed, and will initiate forcefull shutdown
exports.forceShutDownTime = 10000;
