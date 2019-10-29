const idleTimeoutHandler = require("../../libs/idle-timeout-handler");
const { logger } = require("../../libs/logger");
const sanitize = require("../../libs/sanitizer");

const { messageMaxLength } = require("../../config/config");
const { WEBSOCKET_OPEN } = require("../../config/constants");

module.exports = (webSocket, sessions, req) => {
  webSocket.on("message", message => {
    const { userName } = req.session;
    const session = sessions.get(userName);
    const safeMessage = sanitize(message);

    // in "cookie-session" we need to manualy renew cookie live time.
    // For this, we need to change any value inside req.session.
    // Variable "datetime" don't have any other purpose.
    req.session.datetime = Date.now();

    const timer = session.idleTimeoutHandler;
    clearTimeout(timer);
    session.idleTimeoutHandler = idleTimeoutHandler(req, sessions);
    sessions.set(userName, session);

    if (safeMessage.length > messageMaxLength) {
      const response = JSON.stringify({
        status: "ERROR",
        event: "MESSAGE_RESPONSE",
        error: `Maximum request length ${messageMaxLength} exceeded.`
      });

      webSocket.send(response);

      logger({
        level: "ERROR",
        description: `${req.socket.localAddress} user ${userName} maximum request length exceeded`
      });
    } else {
      const websocketMessage = JSON.stringify({
        status: "OK",
        event: "MESSAGE",
        payload: {
          from: userName,
          message: safeMessage
        }
      });

      sessions.forEach(client => {
        if (
          client.webSocket &&
          client.webSocket.readyState === WEBSOCKET_OPEN
        ) {
          client.webSocket.send(websocketMessage);
        }
      });

      const response = JSON.stringify({
        status: "OK",
        event: "MESSAGE_RESPONSE",
        payload: { response: `Message is sent.` }
      });

      webSocket.send(response);

      logger({
        level: "MESSAGE",
        description: `${req.socket.localAddress} user ${userName} sent message ${safeMessage}`
      });
    }
  });
};
