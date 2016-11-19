/* globals module require */

const SimpleMovie = require("./simple-movie-model");
const DetailedMovie = require('./detailed-movie.model');

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

        Promise.resolve()
            .then(() => {
                return detailedMovies;
            });
    },
    insertManyDetailedMovies(movies) {
        Promise.resolve()
            .then(() => {
                DetailedMovie.insertMany(movies);
                return movies;
            });
    }
};