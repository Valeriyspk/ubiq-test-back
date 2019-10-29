const { logger } = require("../../libs/logger");

const { WEBSOCKET_OPEN } = require("../../config/constants");

module.exports = (req, sessions) => {
  const { userName } = req.session;
  const session = sessions.get(userName);
  const { webSocket } = session;
  const userList = Array.from(sessions.keys());

  const alert = JSON.stringify({
    status: "ERROR",
    event: "IDLE_TIMEOUT",
    error: "You was disconnected from chat due to inactivity."
  });

  logger({
    level: "INFO",
    description: `${req.socket.localAddress} user ${userName} was disconnected due to inactivity`
  });

  if (webSocket) {
    webSocket.send(alert);
    webSocket.close();
  }

  sessions.delete(userName);
  req.session = null;
  req.socket.end();

  const websocketMessage = JSON.stringify({
    status: "OK",
    event: "LOGIN",
    payload: {
      from: "Chat-Bot",
      message: `${userName} was disconnected due to inactivity`,
      userList
    }
  });

  sessions.forEach(client => {
    if (client.webSocket && client.webSocket.readyState === WEBSOCKET_OPEN) {
      client.webSocket.send(websocketMessage);
    }
  });
};
