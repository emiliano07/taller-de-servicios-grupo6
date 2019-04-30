const SearchCommands = {
  allByName: (unqfy, args) => {
    const result = unqfy.searchByName(args);
    console.log(result);
  },

  tracksByArtist: (unqfy, artistId) => {
    const tracks = unqfy.getTracksMatchingArtist(Number(artistId));
    console.log(tracks);
  },

  tracksByGenres: (unqfy, genres) => {
    const tracks = unqfy.getTracksMatchingGenres(genres);
    console.log(tracks);
  }
};

module.exports = SearchCommands;
