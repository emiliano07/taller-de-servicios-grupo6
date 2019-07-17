const rp = require('request-promise');
const promisify = require('util').promisify;
const portfinder = require('portfinder');
const loggly = require('loggly');

const LOGGING_BASEURL = require('../config').LOGGING_BASEURL;

class Logger {

  constructor() {
    this.active = true;
    this.logglyClient = loggly.createClient({
      token: '94c4ceff-f22a-47de-9347-b8bca6ce6809',
      subdomain: 'hernanslavich'
    });
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
      }).catch(error => console.log('No se pudo conectar al servicio de logging: ' + error.message));
    }
  }

  logToLoggly(text) {
    this.logglyClient.log(text, (err, result) => {
      console.log(text);
      console.log('log enviado a loggly');
      console.log(result);
    });
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
    }).catch(error => console.log('No se pudo conectar al servicio de logging: ' + error.message));
  }
}

module.exports = { Logger };