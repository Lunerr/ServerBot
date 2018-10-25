const BaseRepository = require('./BaseRepository.js');
const ClientQuery = require('../queries/ClientQuery.js');
const Client = require('../models/Client.js');

class ClientRepository extends BaseRepository {
  anyClient(clientId) {
    return this.any(new ClientQuery(clientId));
  }

  async getClient(clientId) {
    const query = new ClientQuery(clientId);
    const fetchedGuild = await this.findOne(query);

    return fetchedGuild ? fetchedGuild : this.findOneAndReplace(query, new Client(clientId));
  }

  updateClient(clientId, update) {
    return this.updateOne(new ClientQuery(clientId), update);
  }

  findClientAndUpdate(clientId, update) {
    return this.findOneAndUpdate(new ClientQuery(clientId), update);
  }

  async upsertClient(clientId, update) {
    if (await this.anyGuild(clientId)) {
      return this.updateGuild(clientId, update);
    }

    return this.updateOne(new Client(clientId), update, true);
  }

  async findClientAndUpsert(clientId, update) {
    if (await this.anyGuild(clientId)) {
      return this.findGuildAndUpdate(clientId, update);
    }

    return this.findOneAndUpdate(new Client(clientId), update, true);
  }

  deleteClient(clientId) {
    return this.deleteOne(new ClientQuery(clientId));
  }
}

module.exports = ClientRepository;
