const simpleUserData = require("../data/simple-user-data");
const urlQueueProvider = require("../utils/url-queue-provider");
const logger = require("../utils/file-logger");

const httpRequester = require("../utils/http-requester");
const htmlParser = require("../utils/html-parser");

function wait(time) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, time);
    });
}

function getDetailedMovies() {
    simpleUserData.findPage(30, 3)
        .then((movie) => {
            return urlQueueProvider.getUrlQueueFromSimpleMovies(movie);
        })
        .then((urlQueue) => {
            while (!urlQueue.isEmpty()) {
                getDetailedMovieFromImdbUrl(urlQueue.pop());
            }
        })
        .catch((err) => {
            logger.logError(err);
        });
}

function getDetailedMovieFromImdbUrl(url) {
    logger.logOperation(url);

    httpRequester.get(url)
        .then((result) => {
            return htmlParser.parseDetailedMovie(result.body);
        })
        .then((detailedMovieObject) => {
            logger.logOperation(url);
            console.log(detailedMovieObject);
        })
        .catch((err) => {
            logger.logError(err);
        });
}

module.exports = getDetailedMovies;