const login = require("./login");
const logout = require("./logout");
const getUsers = require("./logout");
const checkUserStatus = require("./check-user-status");

module.exports = (app, sessions) => {
  login(app, sessions);
  logout(app, sessions);
  getUsers(app, sessions);
  checkUserStatus(app, sessions);
};
