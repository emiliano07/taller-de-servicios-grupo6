
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
    }

}

module.exports = Album;
module.exports = Artist;