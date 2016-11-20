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

let actorsUrlQueue = [];
function getActors() {
    return detailedMoviesData.findAll()
        .then((detailedMovies) => {
            if (detailedMovies.length === 0) {
                console.log("end");
                return null;
            }

            const allActors = [];
            detailedMovies.forEach(m => {
                allActors.push(...m.actors);
            });

            const filteredActors = [];
            allActors.forEach(a => {
                const exists = filteredActors.some(fa => fa.name === a.name);
                if (!exists) {
                    filteredActors.push(a);
                }
            });

            return filterExistingActors(filteredActors);
        })
        .then((existingActors) => {
            const actors = existingActors.map(a => modelsFactory.getActor(a));
            return modelsFactory.insertManyActors(actors);
        })
        .then((actors) => {
            logger.logOperation(`${new Date().toString()} Inserted ${actors.length} actors.`);
        })
        // .then((existingActors) => {
        //     if (existingActors.length === 0) {
        //         return getActors();
        //     }

        //     return urlQueueProvider.getUrlQueueForActors(existingActors);
        // })
        // .then((urlQueue) => {
        //     actorsUrlQueue = urlQueue;
        //     Array.from({ length: 15 })
        //         .forEach(_ => getActorFromImdbUrl(actorsUrlQueue.pop()));
        // })
        .catch((err) => {
            logger.logError(err);
        });
}

function getActorFromImdbUrl(url) {
    logger.logOperation(`Starting ${url}`);

    return httpRequester.get(url)
        .then((result) => {
            // TODO:
            return htmlParser.parseDetailedMovie(result.body);
        })
        .then((actorFromHtml) => {
            const mongoActor = modelsFactory.getActor(actorFromHtml);
            return mongoActor;
        })
        .then((actor) => {
            return modelsFactory.insertManyActors([actor]);
        })
        .then((actors) => {
            logger.logOperation(`Finished ${actors[0].name}`);
        })
        .then(() => {
            return wait(1000);
        })
        .then(() => {
            if (actorsUrlQueue.isEmpty) {
                logger.logOperation(`${new Date().toString()} Actors url finished.`);
                return;
            }

            getActorFromImdbUrl(actorsUrlQueue.pop());
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