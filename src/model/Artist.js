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

  getName() {
    return this.name;
  }

  removeAlbum(albumId) {
    this.albums = this.albums.filter(a => a.id !== albumId);
  }

  getTracks() {
    let a = []
    return this.albums.map(album => album.getTracks()).
      reduce(function (a, b) { return a.concat(b) }, []);
  }
  
  toJSON(){
    let data = {
        id : this.id,
        name : this.name,
        country : this.country,
        albums : this.albums
    };
    return data;
  }
}

module.exports = {
  Artist,
};