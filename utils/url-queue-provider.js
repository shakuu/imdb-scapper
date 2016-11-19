const queueFactory = require("../data-structures/queue");

function getUrlQueueFromSimpleMovies(movies) {
    const promise = new Promise((resolve) => {
        const urlQueue = queueFactory.getQueue();
        movies.forEach(movie => {
            const movieImdbUrl = getMovieUrlFromImdbId(movie.imdbId);
            urlQueue.push(movieImdbUrl);
        });

        return resolve(urlQueue);
    });

    return promise;
}

function getUrlQueueForActors(actors) {
    const promise = new Promise((resolve) => {
        const urlQueue = queueFactory.getQueue();
        actors.forEach(a => {
            const movieImdbUrl = a.url;
            urlQueue.push(movieImdbUrl);
        });

        return resolve(urlQueue);
    });

    return promise;
}

// /title/tt0067992/?ref_=adv_li_tt
function getMovieUrlFromImdbId(imdbId) {
    return `http://www.imdb.com/title/${imdbId}/?ref_=adv_li_tt`;
}

module.exports = {
    getUrlQueueFromSimpleMovies,
    getUrlQueueForActors
};