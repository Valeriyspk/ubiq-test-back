const cookieSession = require("cookie-session");
const Keygrip = require("keygrip");

const { maxAge } = require("../config/config");

module.exports = app => {
  app.use(
    cookieSession({
      name: "sss",
      keys: new Keygrip(["key1", "key2"], "SHA384", "base64"),
      maxAge
    })
  );
};
