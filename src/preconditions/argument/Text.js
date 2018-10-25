const patron = require('patron.js');

class TextChannel extends patron.ArgumentPrecondition {
  constructor() {
    super({
      name: 'textchannel'
    });
  }

  async run(command, msg, argument, args, value) {
    if (value.guild === null || value.guild === undefined || value.type !== 'text') {
      return patron.PreconditionResult.fromError(command, 'you must provide a text channel.');
    }

    return patron.PreconditionResult.fromSuccess();
  }
}

module.exports = new TextChannel();