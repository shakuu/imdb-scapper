const fs = require("fs");
const os = require("os");

const config = require("../config/constants");

function logError(err) {
    fs.appendFile(config.errorLog, `${new Date().toString()} ${err.message}`, (err) => {
        if (err) {
            console.log(err.message);
        }
    });
}

function logOperation(url) {
    fs.appendFile(config.operationsLog, `${new Date().toString()} ${url}${os.EOL}`, (err) => {
        if (err) {
            console.log(err.message);
        }
    });
}

module.exports = {
    logError,
    logOperation
};