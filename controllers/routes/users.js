const { logger } = require("../../libs/logger");

module.exports = (app, sessions) => {
  app.get("/api/userList", (req, res) => {
    if (req.session.userName) {
      const { userName } = req.body;
      const userList = Array.from(sessions.keys());

      logger({
        level: "INFO",
        description: `${req.socket.localAddress} user ${userName} fetched users`
      });

      //  TODO check are users in valid format
      const response = JSON.stringify({
        status: "OK",
        event: "GET_USERS",
        payload: { userList }
      });

      res.send(response);
    } else {
      logger({
        level: "WARNING",
        description: `${req.socket.localAddress} made unauthorized attempt to fetch users`
      });

      const response = JSON.stringify({
        status: "ERROR",
        event: "GET_USERS",
        error: "Unauthorized attempt. Request declined"
      });

      res.status(401).send(response);
    }
  });
};
