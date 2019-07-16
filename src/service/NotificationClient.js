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
      .catch(error => console.log(error));
  }
};

module.exports = NotificationClient;
