class Album {
    constructor(name, year, id) {
      this.id = id;
      this.name = name;
      this.year = year;
      this.tracks = [];
    }
  
    addTrack(track) {
      this.tracks.push(track);
      return track;
    }
  
    getTracks(){
      return this.tracks
  }
}

module.exports = {
  Album,
};