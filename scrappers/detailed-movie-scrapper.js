const simpleMovieData = require("../data/simple-user-data");
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

let index = 1;
function getDetailedMovies() {
    return simpleMovieData.findPage(index, 3)
        .then((simpleMoviesFromMongoDb) => {
            if (simpleMoviesFromMongoDb.length === 0) {
                console.log("end");
                return null;
            }

            return urlQueueProvider.getUrlQueueFromSimpleMovies(simpleMoviesFromMongoDb);
        })
        .then((urlQueue) => {
            return Promise.all(
                urlQueue.items.map(url => {
                    return getDetailedMovieFromImdbUrl(url);
                }));
        })
        .then(() => {
            return wait(1000);
        })
        .then(() => {
            index += 1;
            return getDetailedMovies();
        })
        .catch((err) => {
            logger.logError(err);
        });
}

function getDetailedMovieFromImdbUrl(url) {
    logger.logOperation(url);

    return httpRequester.get(url)
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