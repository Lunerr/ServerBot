const patron = require('patron.js');

class BlockMessages extends patron.Command {
  constructor() {
    super({
      names: ['blockmessages', 'blockmessage', 'setblockmesages'],
      groupName: 'botowners',
      description: 'Toggle block messages.'
    });
  }

  async run(msg) {
    const blockMessages = !msg.dbClient.blockMessages;

    await msg.client.db.clientRepo.updateClient(msg.client.user.id, { $set: { blockMessages } });

    return msg.createReply('you\'ve successfully ' + (blockMessages ? 'enabled' : 'disabled') + ' to block messages including blacklisted words.');
  }
}

module.exports = new BlockMessages();