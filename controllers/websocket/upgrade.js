const { logger } = require("../../libs/logger");

module.exports = (app, webSocketServer) => {
  app.on("upgrade", (req, socket, head) => {
    if (!req.session || !req.session.userName) {
      socket.destroy();

      logger({
        level: "ERROR",
        description: `${req.socket.localAddress} failed to upgrade, no active session.`
      });
    } else {
      const { userName } = req.session;

      webSocketServer.handleUpgrade(req, socket, head, webSocket => {
        logger({
          level: "INFO",
          description: `${req.socket.localAddress} user ${userName} successfully upgraded connection up to Websocket protocol.`
        });

        webSocketServer.emit("connection", webSocket, req);
      });
    }
  });
};
