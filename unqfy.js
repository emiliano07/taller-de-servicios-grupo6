
const picklify = require('picklify'); // para cargar/guarfar unqfy
const fs = require('fs'); // para cargar/guarfar unqfy

const Artist = require('./src/model/Artist').Artist;
const Album = require('./src/model/Album').Album;
const Track = require('./src/model/Track').Track;
const PlayList = require('./src/model/PlayList').PlayList;
const modelExep = require('./src/model/ModelException');


class UNQfy {

  constructor() {
    this.idArtist = 0;
    this.idAlbum = 0;
    this.idTrack = 0;
    this.idPlaylist = 0;
    this.listOfArtists = [];
    this.listOfAlbums = [];
    this.listOfTracks = [];
    this.playLists = [];
  }

  // artistData: objeto JS con los datos necesarios para crear un artista
  //   artistData.name (string)
  //   artistData.country (string)
  // retorna: el nuevo artista creado
  addArtist(artistData) {
    if (this.listOfArtists.find(artist => artist.name === artistData.name && artist.country === artistData.country)) {
      throw new modelExep.DuplicatedException('Artista duplicado');
    }
    const newArtist = new Artist(artistData.name, artistData.country, this.getIdForArtist());
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
    if (this.getAlbums().find(album => album.name === albumData.name && album.year === albumData.year)) {
      throw new modelExep.DuplicatedException("album duplicado")
    }
    const artist = this.getArtistById(artistId);
    const album = new Album(albumData.name, albumData.year, this.getIdForAlbum());
    artist.addAlbum(album);
    album.setArtist(artist);
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
    let aPlayList = new PlayList(this.getIdForPlaylist(), name, genresToInclude, maxDuration);
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
      albums: this.listOfAlbums.filter(search),
      tracks: this.listOfTracks.filter(search),
      playlists: this.playLists.filter(search)
    };
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

  getIdForPlaylist() {
    const id = this.idPlaylist;
    this.idPlaylist++;
    return id;
  }

  getAlbums() {
    let a = [];
    return this.listOfArtists.map(artista => artista.getAlbums())
      .reduce((a, b) => a.concat(b), []);
  }

  getAlbumById(id) {
    let albumFound = this.getAlbums().find(album => album.id == id)
    if (!albumFound) { throw new modelExep.NotFoundException('Album no encontrado') }
    return albumFound
  }

  getTrackById(id) {
    const track = this.listOfTracks.find(track => track.id === id);
    if (!track) {
      throw new modelExep.NotFoundException('Track no encontrado');
    }
    return track;
  }

  getPlaylistById(id) {
    const playlist = this.playLists.find(pl => pl.id === id);
    if (!playlist) {
      throw new modelExep.NotFoundException('Playlist no encontrado');
    }
    return playlist;
  }

  getArtistById(id) {
    let artistFound = this.listOfArtists.find(artist => artist.id === id);
    if (!artistFound) { throw new modelExep.NotFoundException('Artista no encontrado') }
    return artistFound;
  }

  getArtistByName(name) {
    let artistFound = this.listOfArtists.find(artist => artist.name === name);
    if (!artistFound) { throw new modelExep.NotFoundException('Artista no encontrado') }
    return artistFound;
  }

  getTracks() {
    let a = [];
    return this.getAlbums().map(album => album.tracks)
      .reduce((a, b) => a.concat(b), []);
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

  deleteArtist(artistId) {
    const artist = this.getArtistById(artistId);
    artist.getAlbums().map(a => this.deleteAlbum(a.id));
    this.listOfArtists = this.listOfArtists.filter(a => a.id !== artistId);
  }

  deleteAlbum(albumId) {
    const album = this.getAlbumById(albumId);
    album.artist.removeAlbum(albumId);
    album.getTracks().map(t => this.deleteTrack(t.id));
    this.listOfAlbums = this.listOfAlbums.filter(a => a.id !== albumId);
  }

  deleteTrack(trackId) {
    const track = this.getTrackById(trackId);
    track.album.removeTrack(trackId);
    this.listOfTracks = this.listOfTracks.filter(t => t !== track);
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
    const classes = [UNQfy, Artist, Album, Track, PlayList];
    return picklify.unpicklify(JSON.parse(serializedData), classes);
  }
}

// COMPLETAR POR EL ALUMNO: exportar todas las clases que necesiten ser utilizadas desde un modulo cliente
module.exports = {
  UNQfy,
};

