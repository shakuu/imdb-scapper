const fs = require("fs");
const os = require("os");

function logError(err) {
    fs.appendFile("errors.log", `${new Date().toString()} ${err.message}`);
}

function logOperation(url) {
    fs.appendFile("parsed-urls.log", `${new Date().toString()} ${url}${os.EOL}`);
}

module.exports = {
    logError,
    logOperation
};