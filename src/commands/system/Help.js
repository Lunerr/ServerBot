const patron = require('patron.js');
const Constants = require('../../utility/Constants.js');

class Help extends patron.Command {
  constructor() {
    super({
      names: ['help', 'commands', 'command', 'cmd', 'cmds', 'support', 'docs'],
      groupName: 'system',
      description: 'All command information.',
      usableContexts: [patron.Context.DM, patron.Context.Guild],
      args: [
        new patron.Argument({
          name: 'command',
          key: 'command',
          type: 'string',
          example: 'money'
        })
      ]
    });
  }

  async run(msg, args) {
    args.command = args.command.startsWith(Constants.data.misc.prefix) ? args.command.slice(Constants.data.misc.prefix.length) : args.command;

    const lowerInput = args.command.toLowerCase();
    const command = msg.client.registry.commands.find(x => x.names.some(y => y === lowerInput));

    if (!command) {
      return msg.createErrorReply('this command does not exist.');
    }

    return msg.channel.createMessage('**Description:** ' + command.description + '\n**Usage:** `' + Constants.data.misc.prefix + command.getUsage() + '`\n**Example:** `' + Constants.data.misc.prefix + command.getExample() + '`', { title: command.names[0].upperFirstChar() });
  }
}

module.exports = new Help();