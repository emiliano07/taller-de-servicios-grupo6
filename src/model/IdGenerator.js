class IdGenerator {
  constructor() {
    this.idArtist = 0;
    this.idAlbum = 0;
    this.idTrack = 0;
    this.idPlaylist = 0;
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
}
  
module.exports = {
  IdGenerator,
};