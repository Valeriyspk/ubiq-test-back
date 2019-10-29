const upgrade = require("./upgrade");
const connection = require("./connection");

module.exports = (app, webSocketServer, sessions) => {
  upgrade(app, webSocketServer);
  connection(app, sessions);
};
