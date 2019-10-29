const websocketHandlTimeout = require("../controllers/websocket/timeout");

const { idleTimeoutValue } = require("../config/config");

const destroy = (req, sessions) => {
  websocketHandlTimeout(req, sessions);
};

module.exports = (req, sessions) => {
  const timeout = setTimeout(destroy, idleTimeoutValue, req, sessions);
  return timeout;
};
