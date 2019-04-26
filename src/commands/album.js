const AlbumCommands = {
  add: (unqfy, args) => {
    const name = args[0];
    const year = args[1];
    const artistId = args[2];

    unqfy.addAlbum(artistId, {
      name: name,
      year: year,
    });

    unqfy.save();

    console.log('Album created.');
  },

  list: (unqfy) => unqfy.listOfAlbums.map(album => console.log(album)),

  print: (unqfy, albumId) => {
    const album = unqfy.getAlbumById(Number(albumId));

    if (album === undefined) {
      console.log(`Album ${albumId} not found.`);
    } else {
      console.log(album);
    }
  }
};

module.exports = AlbumCommands;
