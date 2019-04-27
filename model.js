
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

  getAlbums(){
    return this.albums
  }

  getTracks(){
    let a = []
    return this.albums.map( album => album.getTracks()).
                        reduce( function (a,b) { return a.concat(b) }, []);
  }
}

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

class Track {
  constructor(name, duration, genres, id) {
    this.id = id;
    this.name = name;
    this.duration = duration;
    this.genres = genres;
  }

  includesGenres( genres ){
    return this.genres.some( genre => genres.includes(genre) )
}
}

class PlayList{
  constructor( name, genresToInclude, maxDuration ){
      this.name = name;
      this.genresToInclude = genresToInclude;
      this.maxDuration = maxDuration;
      this.tracks = [];
  }

  duration(){
      let a = 0; 
      return this.tracks.map( track => track.duration ).
                          reduce( function(a,b){ return a = a+b } );
  }

  hasTrack(aTrack){
      return this.tracks.includes(aTrack);
  }

}

module.exports = { Album, Artist, Track, PlayList };
