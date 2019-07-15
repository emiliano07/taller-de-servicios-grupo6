const getGmailClient = require('./gmail/gmailClient');

class NotifyService {
  constructor() {
    this.subscriptions = {};
  }

  subscribe(artistId, email) {
    if (!(artistId in this.subscriptions)) {
      this.subscriptions[artistId] = [];
    }

    if (!this.subscriptions[artistId].includes(email)) {
      this.subscriptions[artistId].push(email);
    }
  }

  unsubscribe(artistId, email) {
    if (!(artistId in this.subscriptions)) {
      return;
    }

    this.subscriptions[artistId] = this.subscriptions[artistId].filter(e => e !== email);
  }

  deleteArtist(artistId) {
    delete this.subscriptions[artistId];

    return this.subscriptions;
  }

  notify(artistId, subject, message, from) {
    const client = getGmailClient();
    const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
    const messageParts = [
      `From: ${from}`,
      'To: hernan.slavich@gmail.com',
      'Content-Type: text/html; charset=utf-8',
      'MIME-Version: 1.0',
      `Subject: ${utf8Subject}`,
      '',
      message,
    ];
    const msg = messageParts.join('\n');
    const encodedMessage = Buffer.from(msg)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
    client.users.messages.send(
      { userId: 'me', requestBody: { raw: encodedMessage } }
    );
  }
}

module.exports = { NotifyService }
