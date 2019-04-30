const PlaylistCommands = {
  create: (unqfy, args) => {
    const name = args[0];
    const duration = args[1];
    const genres = args.slice(2);

    unqfy.createPlaylist(name, genres, duration)

    unqfy.save();

    console.log('Playlist created.');
  },

  list: (unqfy) => unqfy.playLists.map(pl => console.log(pl)),

  print: (unqfy, id) => {
    const playlist = unqfy.getPlaylistById(Number(id));

    console.log(playlist);
  }
};

module.exports = PlaylistCommands;
