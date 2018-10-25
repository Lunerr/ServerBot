const patron = require('patron.js');

class AddChannel extends patron.Command {
  constructor() {
    super({
      names: ['addchannel', 'setchannel'],
      groupName: 'botowners',
      description: 'Sets a channel for a message to be taken from, and sent in said channel.',
      args: [
        new patron.Argument({
          name: 'fromChannel',
          key: 'fromChannel',
          type: 'channel',
          preconditions: ['textchannel'],
          example: '498915440966238218'
        }),
        new patron.Argument({
          name: 'toChannel',
          key: 'toChannel',
          type: 'channel',
          example: '496493687480647681',
          preconditions: ['textchannel'],
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    const channel = 'channels.' + args.fromChannel.id;

    await msg.client.db.clientRepo.updateClient(msg.client.user.id, { $set: { [channel]: args.toChannel.id } });

    return msg.createReply('you have successfully added set messages from channel ' + args.fromChannel.name + ' to be sent into channel ' + args.toChannel.name + '.');
  }
}

module.exports = new AddChannel();
