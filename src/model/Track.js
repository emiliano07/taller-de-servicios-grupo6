class Track {
  constructor(name, duration, genres, id) {
    this.id = id;
    this.name = name;
    this.duration = duration;
    this.genres = genres;
    this.lyrics = undefined;
    this.album = undefined;
  }

  getLyric() {
    return this.lyric;
  }

  setAlbum(album) {
    this.album = album;
  }

  includesGenres(genres) {
    return this.genres.some(genre => genres.includes(genre))
  }

  toJSON(){
    let data = {
        id : this.id,
        name : this.name,
        duration : this.duration,
        genres : this.genres,
        lyric : this.lyrics,
    };
    return data;
  }
}

module.exports = {
  Track,
};