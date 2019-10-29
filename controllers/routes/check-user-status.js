const { logger } = require("../../libs/logger");

module.exports = (app, sessions) => {
  app.post("/api/checkuserstatus", (req, res) => {
    if (
      req.session &&
      req.session.userName &&
      sessions.has(req.session.userName)
    ) {
      const { userName } = req.session;

      logger({
        level: "INFO",
        description: `${req.socket.localAddress} user ${userName} successfully checked login status. User is loged in `
      });

      const response = JSON.stringify({
        status: "OK",
        event: "CHECK_USER_STATUS",
        payload: { userLogedIn: true }
      });

      res.send(response);
    } else {
      if (req.session) {
        req.session.userName = null;
      }

      logger({
        level: "INFO",
        description: `${req.socket.localAddress} successfully checked login status. User not loged in`
      });

      const response = JSON.stringify({
        status: "OK",
        event: "CHECK_USER_STATUS",
        payload: { userLogedIn: false }
      });

      res.send(response);
    }
  });
};
