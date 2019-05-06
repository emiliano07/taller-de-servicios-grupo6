class Artist {
  constructor(name, country, id) {
    this.id = id;
    this.name = name;
    this.country = country;
    this.albums = [];
  }

  addAlbum(album) {
    this.albums.push(album);
    return album;
  }

  getAlbums() {
    return this.albums;
  }

  removeAlbum(albumId) {
    this.albums = this.albums.filter(a => a.id !== albumId);
  }

  getTracks() {
    let a = []
    return this.albums.map(album => album.getTracks()).
      reduce(function (a, b) { return a.concat(b) }, []);
  }
}

module.exports = {
  Artist,
};