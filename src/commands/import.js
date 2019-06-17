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

module.exports = { populateAlbumsForArtist }
