const AlbumCommands = {
  add: (unqfy, args) => {
    const name = args[0];
    const year = args[1];
    const artistId = args[2];

    unqfy.addAlbum(Number(artistId), {
      name: name,
      year: year,
    });

    unqfy.save();

    console.log('Album created.');
  },

  delete: (unqfy, albumId) => {
    unqfy.deleteAlbum(Number(albumId));
    unqfy.save();

    console.log('Album eliminado.');
  },

  list: (unqfy) => unqfy.getAlbums().map(album => console.log(album)),

  print: (unqfy, albumId) => {
    const album = unqfy.getAlbumById(Number(albumId));

    console.log(album);
  }
};

module.exports = AlbumCommands;
