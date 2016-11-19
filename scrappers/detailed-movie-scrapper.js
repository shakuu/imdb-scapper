const simpleUserData = require("../data/simple-user-data");
const urlQueueProvider = require("../utils/url-queue-provider");
const logger = require("../utils/file-logger");

const httpRequester = require("../utils/http-requester");

function getDetailedMovies(options) {
    options.pageSize = options.pageSize || 10;
    options.pagesCount = options.pageNumber || 0;

    simpleUserData.findPage(1, 10)
        .then((movie) => {
            console.log(movie);
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
    httpRequester.get(url)
        .then((result) => {
            const html = result.body;
        })
        .catch((err) => {
            logger.logError(err);
        });
}

module.exports = getDetailedMovies;