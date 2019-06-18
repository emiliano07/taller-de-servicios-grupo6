const populateAlbumsForArtist = (unqfy, args) => {
  const artistName = args[0];
  const artist = unqfy.getArtistByName(artistName)[0];
  if (!artist) {
    throw new Error(`Artist ${artistName} not found`);
  }
  
  unqfy.searchArtistSpotifyId(artistName, (spotifyId) => {
    unqfy.populateAlbumsForArtist(spotifyId, artist, () => unqfy.save());
  });
};

const importLyrics = (unqfy, args) => {
  const trackId = Number(args[0]);
  const track = unqfy.getTrackById(trackId);

  unqfy.getLyrics(track, (lyrics, error) => {
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
