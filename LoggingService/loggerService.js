const rp = require('request-promise');
const promisify = require('util').promisify;
const portfinder = require('portfinder');

const LOGGING_BASEURL = require('../config').LOGGING_BASEURL;
const NOTIFICATION_BASEURL = require('../config').NOTIFICATION_BASEURL;

class Logger {

  constructor() {
    this.active = false;
  }

  activate() {
    return this.activatePromise().then(result => {
      this.active = result;
    })
  }

  activatePromise() {
    return new Promise(function (resolve, reject) {
      resolve(true);
    })
  }

  deactivate() {
    return this.deactivatePromise().then(result => {
      this.active = result;
    })
  }

  deactivatePromise() {
    return new Promise(function (resolve, reject) {
      resolve(false);
    })
  }

  getStatus() {
    let active = this.active
    return new Promise(function (resolve, reject) {
      resolve(active);
    })
  }

  getStatusOfUNQfy() {
    portfinder.basePort = 5000;
    portfinder.highestPort = 5000;
    return portfinder.getPortPromise();
  }

  getStatusOfNotifier() {
    portfinder.basePort = 5001;
    portfinder.highestPort = 5001;
    return portfinder.getPortPromise();
  }

  log(text) {
    if (this.active) {
      const options = {
        method: 'POST',
        uri: 'https://hooks.slack.com/services/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',
        body: {
          "text": text
        },
        json: true,
      }

      return rp(options).then((response) => {
        console.log("Log enviado!");
      }).catch(() => console.log('No se pudo conectar al servicio de logging'));
    }
  }

  logChangeModel(text) {
    console.log(text)
    let texto = text

    const options = {
      method: 'POST',
      uri: LOGGING_BASEURL + '/log',
      body: {
        text: texto
      },
      json: true,
    }

    rp(options).then((response) => {
      console.log("Log enviado: " + text);
    }).catch(() => console.log('No se pudo conectar al servicio de logging'));
  }
}

module.exports = { Logger };