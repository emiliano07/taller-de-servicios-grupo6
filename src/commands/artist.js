const ArtistCommands = {
  add: (unqfy, args) => {
    unqfy.addArtist({
      name: args[0],
      country: args[1],
    });

    unqfy.save();

    console.log('Artist created.');
  },

  list: (unqfy) => unqfy.listOfArtists.map(artist => console.log(artist)),

  print: (unqfy, artistId) => {
    const artist = unqfy.getArtistById(Number(artistId));

    if (artist === undefined) {
      console.log(`Artist ${artistId} not found.`);
    } else {
      console.log(artist);
    }
  }
};

module.exports = ArtistCommands;
