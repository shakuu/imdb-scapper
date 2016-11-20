const urlQueueProvider = require("../utils/url-queue-provider");
const logger = require("../utils/file-logger");

const httpRequester = require("../utils/http-requester");
const htmlParser = require("../utils/html-parser");
const modelsFactory = require("../models");
const detailedMoviesData = require("../data/detailed-user-data");
const actorsData = require("../data/actors-data");

function wait(time) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, time);
    });
}

function getActors() {
    return detailedMoviesData.findAll()
        .then((detailedMovies) => {
            if (detailedMovies.length === 0) {
                console.log("end");
                return null;
            }

            // TODO: Aggregate actors from each movie
            return filterExistingActors(detailedMovies.actors);
        })
        .then((existingActors) => {
            if (existingActors.length === 0) {
                return getActors();
            }

            return urlQueueProvider.getUrlQueueForActors(existingActors);
        })
        .then((urlQueue) => {
            return Promise.all(
                urlQueue.items.map(url => {
                    return getActorFromImdbUrl(url);
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
            return getActors();
        })
        .catch((err) => {
            logger.logError(err);
        });
}

// TODO:
function getActorFromImdbUrl(url) {
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

function filterExistingActors(actors) {
    const filteredActors = [];
    return Promise.all(
        actors.map(a => {
            return actorsData.findByName(a.name);
        }))
        .then((results) => {
            results.forEach((r, i) => {
                if (r.length === 0) {
                    filteredActors.push(actors[i]);
                } else {
                    logger.logOperation(`${new Date().toString()} Exising actor ${actors[i].name}`);
                }
            });

            return filteredActors;
        });
}

module.exports = getActors;