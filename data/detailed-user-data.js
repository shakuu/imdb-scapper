const DetailedMovie = require("../models/detailed-movie.model");

function findByName(name) {
    const promise = new Promise((resolve, reject) => {
        DetailedMovie.find({ title: new RegExp(name, "i") }, (err, response) => {
            if (err) {
                return reject(err);
            }

            resolve(response);
        });
    });

    return promise;
}

function findAll() {
    const promise = new Promise((resolve, reject) => {
        DetailedMovie.find({}, (err, res) => {
            if (err) {
                return reject(err);
            }

            resolve(res);
        });
    });

    return promise;
}

module.exports = {
    findByName,
    findAll
};