/* eslint-disable no-console */
/* eslint-disable no-use-before-define */
const { loggerAsync } = require("./logger");

const { forceShutDownTime } = require("../config/config");
const { WEBSOCKET_OPEN } = require("../config/constants");

const sigs = ["SIGINT", "SIGTERM", "SIGQUIT"];

module.exports = (webSocketServer, sessions, server) => {
  sigs.forEach(sig => {
    process.on(sig, () => {
      const initDescription = "Server shutdown initiated";

      console.log(initDescription);

      loggerAsync("WARNING", initDescription)
        .then(() => sendMessageToChat(sessions))
        .then(description => loggerAsync("WARNING", description))
        .then(() => destroyWebsocketServer(webSocketServer))
        .then(description => loggerAsync("WARNING", description))
        .then(() => destroyExpressServer(server))
        .then(description => loggerAsync("WARNING", description))
        .then(() => finalizeShutdown())
        .catch(err => handleError(err));

      setTimeout(forceShutdown, forceShutDownTime);
    });
  });
};

const sendMessageToChat = sessions => {
  return new Promise(resolve => {
    const description = "Message to users is sent";

    const websocketMessage = JSON.stringify({
      status: "OK",
      event: "SHUTDOWN",
      payload: {
        from: "Chat-Bot",
        message: `Warning! Server is shutting down!`
      }
    });

    const messages = [];

    sessions.forEach(client => {
      if (client.webSocket && client.webSocket.readyState === WEBSOCKET_OPEN) {
        messages.push(sendMessage(client, websocketMessage));
      }
    });

    return Promise.all(messages).then(() => {
      console.log(description);
      resolve(description);
    });
  });
};

const sendMessage = (client, websocketMessage) => {
  return new Promise(resolve => {
    client.webSocket.send(websocketMessage, () => {
      resolve();
    });
  });
};

const destroyWebsocketServer = webSocketServer => {
  return new Promise(resolve => {
    const description = "Websocket server is closed";

    webSocketServer.close(() => {
      console.log(description);
      resolve(description);
    });
  });
};

const destroyExpressServer = server => {
  return new Promise(resolve => {
    const description = "Server successfully closed";

    server.close(() => {
      console.log(description);
      resolve(description);
    });
  });
};

const finalizeShutdown = () => {
  process.exit(0);
};

const handleError = async err => {
  const errorMessage = `Failed to handle shutdown: ${err}`;

  console.error(errorMessage);

  await loggerAsync("ERROR", errorMessage);

  forceShutdown();
};

const forceShutdown = async () => {
  const errorMessage = `Failed to close server in time, forcefully shutting down`;

  console.error(errorMessage);

  await loggerAsync("ERROR", errorMessage);

  process.exit(1);
};
