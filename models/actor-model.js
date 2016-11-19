const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const actorSchema = new Schema({
    name: String,
    character: String,
    imdbId: String,
    image: String,
    url: String
});

let Actor;
actorSchema.statics.getActorFromObject = function (movieObject) {
    return new Actor({
        name: movieObject.name,
        character: movieObject.character,
        imdbId: movieObject.imdbId,
        image: movieObject.image,
        url: movieObject.url
    });
};

mongoose.model("Actor", actorSchema);
Actor = mongoose.model("Actor");

module.exports = Actor;