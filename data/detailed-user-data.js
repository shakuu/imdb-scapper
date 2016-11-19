const DetailedMovie = require("../models/detailed-movie.model");

function findByName(name) {
    const promise = new Promise((resolve, reject) => {
        DetailedMovie.find({ title: new RegExp(name, "i") }, (err, response) => {
            if (err) {
                return reject(err);
            }

            return resolve(response);
        });
    });

    return promise;
}

module.exports = { findByName };