const { MongoClient } = require('mongodb');
const util = require('util');
const GuildRepository = require('./repositories/GuildRepository.js');
const ClientRepository = require('./repositories/ClientRepository.js');

class Database {
  constructor() {
    this.queries = {
      Guild: require('./queries/GuildQuery.js'),
      Client: require('./queries/ClientQuery.js'),
      Id: require('./queries/IdQuery.js')
    };

    this.updates = {
      Pull: require('./updates/PullUpdate.js'),
      Push: require('./updates/PushUpdate.js')
    };

    this.models = {
      Guild: require('./models/Guild.js'),
      Client: require('./models/Client.js')
    };
  }

  async connect(connectionURL) {
    const promisified = util.promisify(MongoClient.connect);
    const connection = await promisified(connectionURL, { useNewUrlParser: true });
    const db = connection.db(connection.s.options.dbName);

    this.clientRepo = new ClientRepository(await db.createCollection('client'));
    this.guildRepo = new GuildRepository(await db.createCollection('guilds'));

    await db.collection('guilds').createIndex('guildId', { unique: true });
    await db.collection('client').createIndex('clientId', { unique: true });
  }
}

module.exports = Database;
