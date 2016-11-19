const simpleMovieData = require("../data/simple-user-data");
const urlQueueProvider = require("../utils/url-queue-provider");
const logger = require("../utils/file-logger");

const httpRequester = require("../utils/http-requester");
const htmlParser = require("../utils/html-parser");
const modelsFactory = require("../models");
const detailedMoviesData = require("../data/detailed-user-data");

function wait(time) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, time);
    });
}

let index = 50;
function getDetailedMovies() {
    return simpleMovieData.findPage(index, 5)
        .then((simpleMoviesFromMongoDb) => {
            if (simpleMoviesFromMongoDb.length === 0) {
                console.log("end");
                return null;
            }

            return filterExistingMovies(simpleMoviesFromMongoDb);
        })
        .then((filteredMovies) => {
            return urlQueueProvider.getUrlQueueFromSimpleMovies(filteredMovies);
        })
        .then((urlQueue) => {
            return Promise.all(
                urlQueue.items.map(url => {
                    return getDetailedMovieFromImdbUrl(url);
                }));
        })
        .then((movieObjects) => {
            return modelsFactory.getDetailedMoviesFromArray(movieObjects);
        })
        .then((movies) => {
            return modelsFactory.insertManyDetailedMovies(movies);
        })
        .then((movies) => {
            logger.logOperation(`Inserted ${movies.length} movies.`);
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
    logger.logOperation(`Starting ${url}`);

    return httpRequester.get(url)
        .then((result) => {
            return htmlParser.parseDetailedMovie(result.body);
        })
        .then((detailedMovieObject) => {
            logger.logOperation(`Finished ${url}`);
            return detailedMovieObject;
        })
        .catch((err) => {
            logger.logError(err);
        });
}

function filterExistingMovies(movies) {
    const filteredMovies = [];
    return Promise.all(
        movies.map(m => {
            return detailedMoviesData.findByName(m.name);
        }))
        .then((results) => {
            results.forEach((r, i) => {
                if (r.length === 0) {
                    filteredMovies.push(movies[i]);
                } else {
                    logger.logOperation(`${new Date().toString()} Exising movie ${movies[i].name}`);
                }
            });

            return filteredMovies;
        });
}

module.exports = getDetailedMovies;