const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
// const WebSocket = require("ws");

const handleRoutes = require("./controllers/routes");
const handleWebsockets = require("./controllers/websocket");
const handleCookieSessions = require("./libs/cookie-session-handler");
const handleRateLimit = require("./libs/rate-limit-handler");
const handleExceptions = require("./libs/exception-handler");
const hadleShutdown = require("./libs/gracefull-shutdown-handler");

const { logger } = require("./libs/logger");

const { port, maxPayload } = require("./config/config");

handleExceptions();

const app = express();
const webSocketServer = require("express-ws")(app);

app.use(helmet());
app.use(cors());
handleRateLimit(app);

app.use(express.json());

const sessions = new Map();

// const server = http.createServer(app);

// const webSocketServer = new WebSocket.Server({
//   clientTracking: false,
//   noServer: true,
//   maxPayload,
//   path: "/hereIsWS"
// });

handleCookieSessions(app);
handleRoutes(app, sessions);
handleWebsockets(app, webSocketServer, sessions);

const server = app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Listening on http://localhost:${port}`);
  logger({
    level: "INFO",
    description: `Server started work on http://localhost:${port}`
  });
});

hadleShutdown(webSocketServer, sessions, server);
