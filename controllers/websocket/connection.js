const { logger } = require("../../libs/logger");
const handleMessage = require("./messages");

module.exports = (app, sessions) => {
  app.ws("/socket", (webSocket, req) => {
    const { userName } = req.session;
    const session = sessions.get(userName);

    session.webSocket = webSocket;
    // TODO check that session obj don't lose data
    sessions.set(userName, session);

    logger({
      level: "INFO",
      description: `${req.socket.localAddress} user ${userName} successfully established Websocket session.`
    });

    handleMessage(webSocket, sessions, req);
  });
};
