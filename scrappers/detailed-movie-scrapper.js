const simpleUserData = require("../data/simple-user-data");
const urlQueueProvider = require("../utils/url-queue-provider");
const logger = require("../utils/file-logger");

function getDetailedMovies() {
    simpleUserData.findPage(1, 10)
        .then((movie) => {
            console.log(movie);
            return urlQueueProvider.getUrlQueueFromSimpleMovies(movie);
        })
        .then((urlQueue) => {
            console.log(urlQueue);
        })
        .catch((err) => {
            logger.logError(err);
        });
}

module.exports = getDetailedMovies;