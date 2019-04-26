
const picklify = require('picklify'); // para cargar/guarfar unqfy
const fs = require('fs'); // para cargar/guarfar unqfy

const Artist = require('./model').Artist;
const Album = require('./model').Album;
const Track = require('./model').Track;


class UNQfy {

  constructor(){
    this.idArtist = 0;
    this.idAlbum = 0;
    this.idTrack = 0;
    this.listOfArtists = [];
    this.listOfAlbums = [];
    this.listOfTracks = [];
  }

  getIdForArtist() {
    const id = this.idArtist;
    this.idArtist++;
    return id;
  }

  getIdForAlbum() {
    const id = this.idAlbum;
    this.idAlbum++;
    return id;
  }

  getIdForTrack() {
    const id = this.idTrack;
    this.idTrack++;
    return id;
  }

  // artistData: objeto JS con los datos necesarios para crear un artista
  //   artistData.name (string)
  //   artistData.country (string)
  // retorna: el nuevo artista creado
  addArtist(artistData) {
    const newArtist = new Artist(artistData.name,artistData.country,this.getIdForArtist());
    this.listOfArtists.push(newArtist);
    return newArtist;
  /* Crea un artista y lo agrega a unqfy.
  El objeto artista creado debe soportar (al menos):
    - una propiedad name (string)
    - una propiedad country (string)
  */
  }

  // albumData: objeto JS con los datos necesarios para crear un album
  //   albumData.name (string)
  //   albumData.year (number)
  // retorna: el nuevo album creado
  addAlbum(artistId, albumData) {
    const artist = this.getArtistById(artistId);

    if (artist === undefined) {
      throw new Error('El artista no existe');
    }

    const album = new Album(albumData.name,albumData.year,this.getIdForAlbum());
    artist.addAlbum(album);
    this.listOfAlbums.push(album);
    return album;
  }

  // trackData: objeto JS con los datos necesarios para crear un track
  //   trackData.name (string)
  //   trackData.duration (number)
  //   trackData.genres (lista de strings)
  // retorna: el nuevo track creado
  addTrack(albumId, trackData) {
    const track = new Track(trackData.name, trackData.duration, trackData.genres, this.getIdForTrack());
    const album = this.getAlbumById(albumId);

    this.listOfTracks.push(track);
    album.addTrack(track);
    return track;
  }

  getArtistById(id) {
    return this.getArtistBy(a => a.id == id, id);
  }

  getArtistBy(filter, valueError) {
    return this.listOfArtists.find(filter);
  }

  getAlbumById(id) {
    return this.getAlbumBy(album => album.id === id);
  }

  getAlbumBy(filter) {
    return this.listOfAlbums.find(filter);
  }

  getTrackById(id) {

  }

  getPlaylistById(id) {

  }

  // genres: array de generos(strings)
  // retorna: los tracks que contenga alguno de los generos en el parametro genres
  getTracksMatchingGenres(genres) {

  }

  // artistName: nombre de artista(string)
  // retorna: los tracks interpredatos por el artista con nombre artistName
  getTracksMatchingArtist(artistName) {

  }


  // name: nombre de la playlist
  // genresToInclude: array de generos
  // maxDuration: duración en segundos
  // retorna: la nueva playlist creada
  createPlaylist(name, genresToInclude, maxDuration) {
  /*** Crea una playlist y la agrega a unqfy. ***
    El objeto playlist creado debe soportar (al menos):
      * una propiedad name (string)
      * un metodo duration() que retorne la duración de la playlist.
      * un metodo hasTrack(aTrack) que retorna true si aTrack se encuentra en la playlist.
  */

  }

  save(filename = 'data.json') {
    const listenersBkp = this.listeners;
    this.listeners = [];

    const serializedData = picklify.picklify(this);

    this.listeners = listenersBkp;
    fs.writeFileSync(filename, JSON.stringify(serializedData, null, 2));
  }

  static load(filename) {
    const serializedData = fs.readFileSync(filename, {encoding: 'utf-8'});
    //COMPLETAR POR EL ALUMNO: Agregar a la lista todas las clases que necesitan ser instanciadas
    const classes = [UNQfy,Artist, Album];
    return picklify.unpicklify(JSON.parse(serializedData), classes);
  }
}

// COMPLETAR POR EL ALUMNO: exportar todas las clases que necesiten ser utilizadas desde un modulo cliente
module.exports = {
  UNQfy,
};

