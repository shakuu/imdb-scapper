const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const genreSchema = new Schema({
    name: String
});

const actorSchema = new Schema({
    name: String,
    character: String,
    imdbId: String,
    image: String
});

const detailedMovieSchema = new Schema({
    image: String,
    trailer: String,
    title: String,
    description: String,
    releaseDate: Date,
    actors: [actorSchema],
    genres: [genreSchema]
});

let DetailedMovie;

detailedMovieSchema.statics.getDetailedMovieFromObject = function (movieObject) {
    return new DetailedMovie({
        image: movieObject.image,
        trailer: movieObject.trailer,
        title: movieObject.title,
        description: movieObject.description,
        releaseDate: movieObject.releaseDate,
        actors: movieObject.actors,
        genres: movieObject.genres
    });
};

mongoose.model("DetailedMovie", detailedMovieSchema);
DetailedMovie = mongoose.model("DetailedMovie");

module.exports = DetailedMovie;