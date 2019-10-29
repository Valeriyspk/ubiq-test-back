/* eslint-disable no-console */
/* eslint-disable security/detect-non-literal-fs-filename */
const fs = require("fs");

exports.logger = ({ level, description }) => {
  const nowUTC = new Date(new Date().toUTCString().substr(0, 25));
  const date = `${nowUTC.getFullYear()}-${nowUTC.getMonth() +
    1}-${nowUTC.getDate()}`;

  fs.mkdir(`./logs/${date}`, { recursive: true }, err => {
    if (err) {
      console.error(err && err.stack ? err.stack : err);
    } else {
      const message = `${nowUTC.toISOString()} ${level} ${description}\r\n`;
      fs.appendFile(`./logs/${date}/logs.txt`, message, subErr => {
        if (subErr) {
          console.error(subErr && subErr.stack ? subErr.stack : subErr);
        }
      });
    }
  });
};

exports.loggerAsync = (level, description) => {
  return new Promise((resolve, reject) => {
    const nowUTC = new Date(new Date().toUTCString().substr(0, 25));
    const date = `${nowUTC.getFullYear()}-${nowUTC.getMonth() +
      1}-${nowUTC.getDate()}`;

    fs.mkdir(`./logs/${date}`, { recursive: true }, err => {
      if (err) {
        console.error(err && err.stack ? err.stack : err);
        reject(err);
      } else {
        const message = `${nowUTC.toISOString()} ${level} ${description}\r\n`;
        fs.appendFile(`./logs/${date}/logs.txt`, message, subErr => {
          if (subErr) {
            console.error(subErr && subErr.stack ? subErr.stack : subErr);
            reject(err);
          } else {
            resolve();
          }
        });
      }
    });
  });
};
