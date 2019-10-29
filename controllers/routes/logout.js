const { logger } = require("../../libs/logger");

const { WEBSOCKET_OPEN } = require("../../config/constants");

module.exports = (app, sessions) => {
  app.post("/api/logout", (req, res) => {
    const { userName } = req.session;
    const session = sessions.get(userName);

    if (session) {
      const { webSocket } = session;
      const userList = Array.from(sessions.keys());

      if (webSocket) webSocket.close();
      sessions.delete(userName);
      req.session = null;
      req.socket.end();

      const websocketMessage = JSON.stringify({
        status: "OK",
        event: "LOGOUT",
        payload: {
          from: "Chat-Bot",
          message: `${userName} left the chat :(`,
          userList
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

      logger({
        level: "INFO",
        description: `${req.socket.localAddress} user ${userName} successfully loged out`
      });

      const response = JSON.stringify({
        status: "OK",
        event: "LOGOUT",
        payload: { message: "successfully loged out" }
      });

      res.send(response);
    }
  });
};
