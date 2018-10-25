const patron = require('patron.js');

class SetPrefix extends patron.Command {
  constructor() {
    super({
      names: ['setprefix'],
      groupName: 'botowners',
      description: 'Toggle block messages.',
      args: [
        new patron.Argument({
          name: 'prefix',
          key: 'prefix',
          type: 'string',
          example: '!',
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    if (args.prefix.length > 1) {
      return msg.createErrorReply('you may not have a prefix over 1 character.');
    }
    
    await msg.client.db.clientRepo.updateClient(msg.client.user.id, { $set: { 'prefix': args.prefix } });

    return msg.createReply('you\'ve successfully set the prefix to ' + args.prefix + '.');
  }
}

module.exports = new SetPrefix();