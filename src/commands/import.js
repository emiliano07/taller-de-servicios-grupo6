const Spotify = require('./../../Spotify').Spotify;
const MusixMatch = require('./../../MusixMatch').MusixMatch;
const modelExep = require('./../model/ModelException');

const populateAlbumsForArtist = (unqfy, args) => {
  const spotify = new Spotify()
  const artistName = args[0];
  const artist = unqfy.getArtistByName(artistName)[0];
  if (!artist) {
    throw new modelExep.ArtistNotFound(artistName);
  }
  
  spotify.searchArtistSpotifyId(artistName, (spotifyId) => {
    spotify.populateAlbumsForArtist(spotifyId, artist, () => unqfy.save());
  });
};

const importLyrics = (unqfy, args) => {
  const musixMatch = new MusixMatch()
  const trackId = Number(args[0]);
  const track = unqfy.getTrackById(trackId);

  musixMatch.getLyrics(track, (lyrics, error) => {
    if (error) {
      console.log(error.message);
      return;
    }

    console.log(lyrics);
    track.lyrics = lyrics;
    unqfy.save();
  });
}

module.exports = { populateAlbumsForArtist, importLyrics }
