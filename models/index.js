/* globals module require */

const SimpleMovie = require("./simple-movie-model");
const DetailedMovie = require('./detailed-movie.model');
const Actor = require("./actor-model");

module.exports = {
    getSimpleMovie(name, url) {
        return SimpleMovie.getSimpleMovieByNameAndUrl(name, url);
    },
    insertManySimpleMovies(movies) {
        SimpleMovie.insertMany(movies);
    },
    getDetailedMoviesFromArray(movieObjects) {
        const detailedMovies = [];
        movieObjects.forEach(obj => {
            const detailedMovie = DetailedMovie.getDetailedMovieFromObject(obj);
            detailedMovies.push(detailedMovie);
        });

        return Promise.resolve()
            .then(() => {
                return detailedMovies;
            });
    },
    insertManyDetailedMovies(movies) {
        return Promise.resolve()
            .then(() => {
                if (movies.length === 0) {
                    return null;
                }

                DetailedMovie.insertMany(movies, (err, res) => {
                    if (err) {
                        throw err;
                    }
                });

                return movies;
            });
    },
    getActor(actor) {
        return Actor.getActorFromObject(actor);
    },
    insertManyActors(actors) {
        return Promise.resolve()
            .then(() => {
                if (actors.length === 0) {
                    return null;
                }

                Actor.insertMany(actors, (err, res) => {
                    if (err) {
                        throw err;
                    }
                });

                return actors;
            });
    }
};