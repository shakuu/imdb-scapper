const fs = require("fs");
const os = require("os");

const config = require("../config/constants");

function logError(err) {
    fs.appendFile(config.errorLog, `${new Date().toString()} ${err.message}`);
}

function logOperation(url) {
    fs.appendFile(config.operationsLog, `${new Date().toString()} ${url}${os.EOL}`);
}

module.exports = {
    logError,
    logOperation
};