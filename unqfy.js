
const picklify = require('picklify'); // para cargar/guarfar unqfy
const fs = require('fs'); // para cargar/guarfar unqfy
const rp = require('request-promise');

const Artist = require('./src/model/Artist').Artist;
const Album = require('./src/model/Album').Album;
const Track = require('./src/model/Track').Track;
const PlayList = require('./src/model/PlayList').PlayList;
const modelExep = require('./src/model/ModelException');
const IdGenerator = require('./src/model/IdGenerator').IdGenerator;
const NotifyService = require('./src/service/NotifyService').NotifyService;
const Logger = require('./LoggingService/loggerService').Logger;

class UNQfy {

  constructor() {
    this.idGenerator = new IdGenerator();
    this.listOfArtists = [];
    this.playLists = [];
    this.notifyService = new NotifyService();
    this.loogingService = new Logger();
  }

  // artistData: objeto JS con los datos necesarios para crear un artista
  //   artistData.name (string)
  //   artistData.country (string)
  // retorna: el nuevo artista creado
  addArtist(artistData) {
    if (this.listOfArtists.find(artist => artist.name === artistData.name && artist.country === artistData.country)) {
      throw new modelExep.DuplicatedException;
    }
    const newArtist = new Artist(artistData.name, artistData.country, this.idGenerator.getIdForArtist());
    this.listOfArtists.push(newArtist);
    this.loogingService.logAddedArtist(newArtist)
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
    if (this.getAlbums().find(album => album.name === albumData.name && album.year === albumData.year)) {
      throw new modelExep.DuplicatedException;
    }
    const artist = this.getArtistById(artistId);
    const album = new Album(albumData.name, albumData.year, this.idGenerator.getIdForAlbum());
    artist.addAlbum(album);
    album.setArtist(artist);
    return album;
  }

  // trackData: objeto JS con los datos necesarios para crear un track
  //   trackData.name (string)
  //   trackData.duration (number)
  //   trackData.genres (lista de strings)
  // retorna: el nuevo track creado
  addTrack(albumId, trackData) {
    const track = new Track(trackData.name, trackData.duration, trackData.genres, this.idGenerator.getIdForTrack());
    const album = this.getAlbumById(albumId);

    album.addTrack(track);
    track.setAlbum(album);
    return track;
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
    let aPlayList = new PlayList(this.idGenerator.getIdForPlaylist(), name, genresToInclude, maxDuration);
    let tracks = []
    this.getTracks().filter(track => track.genres.some(genre => genresToInclude.includes(genre))).
      forEach(track => {
        if (track.duration <= maxDuration) {
          maxDuration = maxDuration - track.duration;
          tracks.push(track)
        }
      });
    aPlayList.tracks = tracks;
    this.playLists.push(aPlayList);
    return aPlayList;
  }

  searchByName(name) {
    const search = obj => obj.name.indexOf(name) !== -1;

    return {
      artists: this.listOfArtists.filter(search),
      albums: this.getAlbums().filter(search),
      tracks: this.getTracks().filter(search),
      playlists: this.playLists.filter(search)
    };
  }

  getAlbums() {
    return this.listOfArtists.reduce((albums, artist) => albums.concat(artist.getAlbums()), []);
  }

  getAlbumById(id) {
    let albumFound = this.getAlbums().find(album => album.id == id)
    if (!albumFound) { throw new modelExep.NotFoundException }
    return albumFound
  }

  getTrackById(id) {
    const track = this.getTracks().find(track => track.id === id);
    if (!track) {
      throw new modelExep.NotFoundException;
    }
    return track;
  }

  getPlaylistById(id) {
    const playlist = this.playLists.find(pl => pl.id === id);
    if (!playlist) {
      throw new modelExep.NotFoundException;
    }
    return playlist;
  }

  getArtistById(id) {
    let artistFound = this.listOfArtists.find(artist => artist.id === id);
    if (!artistFound) { throw new modelExep.NotFoundException }
    return artistFound;
  }

  getArtistByName(artistName) {
    return this.listOfArtists.filter((artist) => artist.getName().toLowerCase().includes(artistName.toLowerCase()));
  }

  getAlbumsByName(albumName) {
    let allAlbums = this.getAlbums();
    let filtered = allAlbums.filter((album) => album.getName().toLowerCase().includes(albumName.toLowerCase()));
    return filtered;
  }

  getTracks() {
    return this.getAlbums().reduce((tracks, album) => tracks.concat(album.tracks), []);
  }

  // genres: array de generos(strings)
  // retorna: los tracks que contenga alguno de los generos en el parametro genres
  getTracksMatchingGenres(genres) {
    return this.getTracks().filter(track => track.includesGenres(genres));
  }

  // artistaId: id de artista
  // retorna: los tracks interpredatos por el artista con id artistaId
  getTracksMatchingArtist(artistaId) {
    return this.getArtistById(artistaId).getTracks();
  }

  getListOfArtist() {
    return this.listOfArtists;
  }

  deleteArtist(artistId) {
    const artist = this.getArtistById(artistId);
    artist.getAlbums().map(a => this.deleteAlbum(a.id));
    this.listOfArtists = this.listOfArtists.filter(a => a.id !== artistId);
  }

  deleteAlbum(albumId) {
    const album = this.getAlbumById(albumId);
    album.artist.removeAlbum(albumId);
    album.getTracks().map(t => this.deleteTrack(t.id));
  }

  deleteTrack(trackId) {
    const track = this.getTrackById(trackId);
    track.album.removeTrack(trackId);
    this.playLists.map(pl => pl.removeTrack(trackId));
  }

  deletePlaylist(playlistId) {
    const playlist = this.getPlaylistById(playlistId);
    this.playLists = this.playLists.filter(p => p !== playlist);
  }

  save(filename = 'data.json') {
    const listenersBkp = this.listeners;
    this.listeners = [];

    const serializedData = picklify.picklify(this);

    this.listeners = listenersBkp;
    fs.writeFileSync(filename, JSON.stringify(serializedData, null, 2));
  }

  static load(filename) {
    const serializedData = fs.readFileSync(filename, { encoding: 'utf-8' });
    //COMPLETAR POR EL ALUMNO: Agregar a la lista todas las clases que necesitan ser instanciadas
    const classes = [UNQfy, Artist, Album, Track, PlayList, IdGenerator, NotifyService, Logger];
    return picklify.unpicklify(JSON.parse(serializedData), classes);
  }
}

// COMPLETAR POR EL ALUMNO: exportar todas las clases que necesiten ser utilizadas desde un modulo cliente
module.exports = {
  UNQfy,
};

