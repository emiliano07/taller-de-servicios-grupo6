const picklify = require('picklify');
const fs = require('fs'); 
const rp = require('request-promise');
const unqmod = require('../../unqfy');
const credentials = JSON.parse(fs.readFileSync(__dirname + '/spotify/spotifyCreds.json'));

class Spotify {

  constructor() {}
  
  populateAlbumsForArtist(unqfy, artistSpotifyId, artist, callback) {
    const options = {
      url: `https://api.spotify.com/v1/artists/${artistSpotifyId}/albums`,
      headers: { Authorization: 'Bearer ' + credentials.access_token },
      json: true,
    };

    rp.get(options).then((response) => {
      response.items.map(album => {
        try {
          unqfy.addAlbum(artist.id, {name: album.name, year: album.release_date});
          console.log(`Album ${album.name} created`);
        } catch (error) {
          console.log(`Error: Album ${album.name} - ${error.message}`);
        }
      });
      callback();
    });
  }

  searchArtistSpotifyId(artistName, callback) {
    const options = {
      url: `https://api.spotify.com/v1/search?type=artist&limit=1&q=${artistName}`,
      headers: { Authorization: 'Bearer ' + credentials.access_token },
      json: true,
    };

    rp.get(options).then((response) => callback(response.artists.items[0].id));
  }
}

module.exports = Spotify;