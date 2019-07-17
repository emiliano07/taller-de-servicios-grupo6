const picklify = require('picklify');
const fs = require('fs'); 
const rp = require('request-promise');
const MUSIXMATCH_URL = 'http://api.musixmatch.com/ws/1.1';
const MUSIXMATCH_KEY = '0147a28e310e40c6108d391dd14cf0ac';
const musicMatchExep = require('../model/MusixmatchException');


class MusixMatch {
  constructor() {}

    getLyrics(track, callback) {
        let options = {
        uri: MUSIXMATCH_URL + '/track.search',
        qs: {
            apikey: MUSIXMATCH_KEY,
            q_artist: track.album.artist.name,
            q_track: track.name
        },
        json: true
        };

        rp.get(options).then(response => {
        const musixmatchTrack = response.message.body.track_list[0];
        if (musixmatchTrack === undefined){
            throw new musicMatchExep.NotFoundLyrics;
        }

        const trackId = response.message.body.track_list[0].track.track_id;

        let options = {
            uri: MUSIXMATCH_URL + '/track.lyrics.get',
            qs: {
            apikey: MUSIXMATCH_KEY,
            track_id: trackId
            },
            json: true
        };

        rp.get(options).then(response => {
            const lyrics = response.message.body.lyrics;
            if (lyrics === undefined) {
            throw new musicMatchExep.NotFoundLyrics;
            }

            callback(response.message.body.lyrics.lyrics_body);
        }).catch(error => callback(null, error));
        }).catch(error => callback(null, error));
    }
}

module.exports = MusixMatch;