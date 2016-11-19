const fs = require("fs");
const os = require("os");

const config = require("../config/constants");

function logError(loggedError) {
    fs.appendFile(config.errorLog, `${new Date().toString()} ${loggedError.message}${os.EOL}`, (err) => {
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