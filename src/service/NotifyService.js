
class NotifyService {
  constructor() {
    this.subscriptions = {};
  }

  subscribe(artistId, email) {
    if (!(artistId in this.subscriptions)) {
      this.subscriptions[artistId] = [];
    }

    this.subscriptions[artistId].push(email);
  }
}

module.exports = { NotifyService }
