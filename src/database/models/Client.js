class Client {
  constructor(clientId) {
    this.clientId = clientId;
    this.blacklistedWords = [];
    this.channels = {};
    this.blockMessages = false;
    this.prefix = '!';
  }
}

module.exports = Client;
