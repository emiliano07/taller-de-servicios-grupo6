class Track {
  constructor(name, duration, genres, id) {
    this.id = id;
    this.name = name;
    this.duration = duration;
    this.genres = genres;
  }

  setAlbum(album) {
    this.album = album;
  }

  includesGenres(genres) {
    return this.genres.some(genre => genres.includes(genre))
  }
}

module.exports = {
  Track,
};