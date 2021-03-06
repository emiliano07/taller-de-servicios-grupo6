class Album {
  constructor(name, year, id) {
    this.id = id;
    this.name = name;
    this.year = year;
    this.tracks = [];
    this.artist = undefined;
  }

  addTrack(track) {
    this.tracks.push(track);
    return track;
  }

  getTracks() {
    return this.tracks;
  }

  getName() {
    return this.name;
  }

  removeTrack(trackId) {
    this.tracks = this.tracks.filter(t => t.id !== trackId);
  }

  setArtist(artist) {
    this.artist = artist;
  }

  toJSON(){
    let data = {
        id : this.id,
        name : this.name,
        year : this.year,
        tracks : this.tracks,
    };
    return data;
  }
  
}

module.exports = {
  Album,
};