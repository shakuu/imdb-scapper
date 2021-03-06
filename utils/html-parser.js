/* globals module require Promise */
'use strict';

const jsdom = require('jsdom').jsdom,
    doc = jsdom(),
    window = doc.defaultView,
    $ = require('jquery')(window);

module.exports.parseSimpleMovie = (selector, html) => {
    $('body').html(html);
    let items = [];
    $(selector).each((index, item) => {
        const $item = $(item);

        items.push({
            title: $item.html(),
            url: $item.attr('href')
        });
    });

    return Promise.resolve()
        .then(() => {
            return items;
        });
};

module.exports.parseDetailedMovie = function (html) {
    $('body').html(html);
    // console.log($('body').html());

    const movie = {
        image: $('div.poster img').attr('src'),
        trailer: $('div.slate a').attr('href'),
        title: $('div.title_wrapper h1').text(),
        description: $('div.plot_summary_wrapper div.plot_summary div.summary_text').text()
            .trim(),
        releaseDate: getDateFromRealeaseDate($('a[title="See more release dates"]').text())
    };

    const genresFromHtml = $('span.itemprop[itemprop="genre"]').text();
    movie.genres = splitGenresFromImdbGenresHtml(genresFromHtml);

    const actors = [];
    $('div#titleCast table.cast_list tr').each((index, item) => {
        if (index === 0) {
            return;
        }

        const row = $(item);

        const parsedName = row.find('td[itemprop="actor"] span').text(),
            parsedCharacter = $(row.find('td.character div a')[0]).text(),
            parsedImdbId = getActorIdmbIdFromHref(row.find('td[itemprop="actor"] a').attr('href')),
            parsedImage = row.find('td.primary_photo a').attr('href');

        const actor = {
            name: parsedName,
            character: parsedCharacter,
            imdbId: parsedImdbId,
            image: parsedImage
        };

        actors.push(actor);
    });

    movie.actors = actors;

    return movie;
};

function getDateFromRealeaseDate(imdbReleaseDate) {
    const bracketIndex = imdbReleaseDate.indexOf('(');
    const dateString = imdbReleaseDate.substring(0, bracketIndex);
    const date = new Date(`15:00 ${dateString}`);

    return date;
}

// /name/nm7368158/?ref_=tt_cl_i1
function getActorIdmbIdFromHref(href) {
    const words = href.split('/');
    return words[2];
}

function splitGenresFromImdbGenresHtml(genresFromHtml) {
    const genresList = [],
        genresChars = genresFromHtml.split('');

    let isDash = false;
    let currentGenre = '';
    const len = genresChars.length;
    for (let i = 0; i < len; i += 1) {
        const nextChar = genresChars.splice(0, 1)[0];
        if (nextChar === '-') {
            isDash = true;
        }

        if (/[A-Z]/.test(nextChar)) {
            if (isDash) {
                isDash = false;
            } else if (currentGenre.length > 0) {
                genresList.push({ name: currentGenre });
                currentGenre = '';
            }
        }

        currentGenre += nextChar;
    }

    genresList.push({ name: currentGenre });
    return genresList;
}