
class Artist {
  constructor(name, country, id) {
    this.name = name;
    this.country = country;
    this.albums = [];
    this.id = id;
  }

  addAlbum(album) {
    this.albums.push(album);
    return album;
  }
}

class Album {
  constructor(name, year, id) {
    this.name = name;
    this.year = year;
    this.id = id;
    this.tracks = [];
  }

  addTrack(track) {
    this.tracks.push(track);
    return track;
  }
}

class Track {
  constructor(name, duration, genres) {
    this.name = name;
    this.duration = duration;
    this.genres = genres;
  }
}

module.exports = { Album, Artist, Track };
