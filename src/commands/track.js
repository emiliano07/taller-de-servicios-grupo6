const TrackCommands = {
  add: (unqfy, args) => {
    const albumId = args[0];
    const name = args[1];
    const trackDuraction = args[2];
    const trackGenres = args.slice(3);

    unqfy.addTrack(Number(albumId), {
      name: name,
      duration: trackDuraction,
      genres: trackGenres
    });

    unqfy.save();

    console.log('Track created.');
  },

  list: (unqfy) => unqfy.listOfTracks.map(track => console.log(track)),

  print: (unqfy, trackId) => {
    const track = unqfy.getTrackById(Number(trackId));

    console.log(track);
  }
};

module.exports = TrackCommands;
