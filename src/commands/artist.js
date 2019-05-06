const ArtistCommands = {
  add: (unqfy, args) => {
    unqfy.addArtist({
      name: args[0],
      country: args[1],
    });

    unqfy.save();

    console.log('Artist created.');
  },

  delete: (unqfy, artistId) => {
    unqfy.deleteArtist(Number(artistId));
    unqfy.save();

    console.log('Artista eliminado.');
  },

  list: (unqfy) => unqfy.listOfArtists.map(artist => console.log(artist)),

  print: (unqfy, artistId) => {
    const artist = unqfy.getArtistById(Number(artistId));

    console.log(artist);
  }
};

module.exports = ArtistCommands;
