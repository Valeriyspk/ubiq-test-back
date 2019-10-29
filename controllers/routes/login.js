/* eslint-disable no-use-before-define */
const idleTimeoutHandler = require("../../libs/idle-timeout-handler");
const { logger } = require("../../libs/logger");
const sanitize = require("../../libs/sanitizer");

const { WEBSOCKET_OPEN } = require("../../config/constants");

// TODO check if cookie session work for returning users

module.exports = (app, sessions) => {
  app.post("/api/login", (req, res) => {
    const userName = sanitize(req.body.userName);

    if (sessions.has(userName)) {
      handleUsernameIsTaken(req, res, userName);
    } else if (userName.length === 0 || userName.length > 20) {
      handleUsernameIsInvalid(req, res, userName);
    } else {
      handleValidLogin(req, res, sessions, userName);
    }
  });
};

const handleUsernameIsTaken = (req, res, userName) => {
  logger({
    level: "ERROR",
    description: `${req.socket.localAddress} failed to login. User name ${userName} is already taken.`
  });

  const response = JSON.stringify({
    status: "ERROR",
    event: "LOGIN",
    error: `Login attempt failed. User name ${userName} is already taken.`
  });

  res.status(409).send(response);
};

const handleUsernameIsInvalid = (req, res, userName) => {
  logger({
    level: "ERROR",
    description: `${req.socket.localAddress} failed to login. User name ${userName} lenght is inappropriate.`
  });

  const response = JSON.stringify({
    status: "ERROR",
    event: "LOGIN",
    error: `Login attempt failed. User name ${userName} length is inappropriate. Must be between 1 and 20 characters.`
  });

  res.status(406).send(response);
};

const handleValidLogin = (req, res, sessions, userName) => {
  req.session.userName = userName;

  sessions.set(userName, {
    idleTimeoutHandler: idleTimeoutHandler(req, sessions)
  });

  const userList = Array.from(sessions.keys());

  const websocketMessage = JSON.stringify({
    status: "OK",
    event: "LOGIN",
    payload: {
      from: "Chat-Bot",
      message: `${userName} joined the chat`,
      userList
    }
  });

  sessions.forEach(client => {
    if (client.webSocket && client.webSocket.readyState === WEBSOCKET_OPEN) {
      client.webSocket.send(websocketMessage);
    }
  });

  logger({
    level: "INFO",
    description: `${req.socket.localAddress} successfully loged in with user name ${userName}`
  });

  const response = JSON.stringify({
    status: "OK",
    event: "LOGIN",
    payload: {
      message: "Login successful",
      userList
    }
  });

  res.send(response);
};
