const rp = require('request-promise');

const CONFIG = require('./../../config');

const NotificationClient = {
  sendUpdate: (artist, albumName) => {
    const options = {
      url: CONFIG.NOTIFICATION_BASEURL + '/notify',
      body: {
        artistId: artist.id,
        subject: `Nuevo album para artista ${artist.name}`,
        message: `Se ha agregado el album ${albumName} al artista ${artist.name}`,
        from: 'UNQfy <UNQfy.notifications@gmail.com>'
      },
      json: true,
    };

    rp.post(options)
      .catch(() => console.log('No se pudo conectar al servicio de notificaciones'));
  },

  deleteArtist: (artistId) => {
    const options = {
      url: CONFIG.NOTIFICATION_BASEURL + '/subscriptions',
      body: {
        artistId: artistId
      },
      json: true,
    };

    rp.delete(options)
      .catch(() => console.log('No se pudo conectar al servicio de notificaciones'));
  }
};

module.exports = NotificationClient;
