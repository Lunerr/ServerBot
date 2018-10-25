const patron = require('patron.js');

class BlacklistWord extends patron.Command {
  constructor() {
    super({
      names: ['blacklistword', 'blacklist'],
      groupName: 'botowners',
      description: 'Blacklists a word being said.',
      args: [
        new patron.Argument({
          name: 'word',
          key: 'word',
          type: 'string',
          example: 'jesus',
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    if (msg.dbClient.blacklistedWords.includes(args.word)) {
      return msg.createErrorReply('this word is already blacklisted.');
    }

    await msg.client.db.clientRepo.updateClient(msg.client.user.id, { $push: { 'blacklistedWords': args.word } });

    return msg.createReply('successfully blacklisted ' + args.word.boldify() + '.');
  }
}

module.exports = new BlacklistWord();
