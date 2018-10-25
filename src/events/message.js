const client = require('../structures/Client.js');
const Constants = require('../utility/Constants.js');
const discord = require('discord.js');
const NumberUtil = require('../utility/NumberUtil.js');
const Logger = require('../utility/Logger.js');
const patron = require('patron.js');
const handler = require('../structures/handler.js');
const MessageService = require('../services/MessageServices.js');

client.on('message', (msg) => {
  (async () => {
    msg.dbClient = await client.db.clientRepo.getClient(msg.client.user.id);

    if (msg.author.bot) {
      return;
    } else if (msg.content.startsWith(msg.dbClient.prefix) === false || msg.dbClient.channels[msg.channel.id] === undefined) {
      return;
    } else if (msg.dbClient.channels[msg.channel.id] !== undefined && msg.content.startsWith(msg.dbClient.prefix) === false) {
      const sendTo = msg.client.channels.get(Object.getOwnPropertyDescriptor(msg.dbClient.channels, msg.channel.id).value);
      const blacklistedWords = msg.dbClient.blacklistedWords;
      let content = '';
      let footer = {
        text: msg.createdAt
      };

      if (msg.attachments.size > 0) {
        if (msg.attachments.every(MessageService.isAttachedImage)){
          content = msg.attachments.first().url;
          footer.icon = 'http://i.imgur.com/BQZJAqT.png';
        }
      } else {
        content = msg.cleanContent;
      }

      for (let i = 0; i < blacklistedWords.length; i++) {
        if (content.toLowerCase().includes(blacklistedWords[i].toLowerCase())) {
          if (msg.dbClient.blockMessages === true) {
            return;
          }

          content = content.toLowerCase().replace(blacklistedWords[i].toLowerCase(), '');
        }
      }

      return sendTo.createMessage('**User:** ' + msg.author.tag + '\n**Guild:** ' + msg.guild.name + '\n**Channel:** ' + msg.channel.name + '\n**Content:** ' + content, { footer: footer });
    }

    const result = await handler.run(msg, msg.dbClient.prefix.length);

    if (result.success === false) {
      let message;

      switch (result.commandError) {
        case patron.CommandError.CommandNotFound: {
          return;
        }
        case patron.CommandError.Cooldown: {
          const cooldown = NumberUtil.msToTime(result.remaining);

          return msg.channel.tryCreateErrorMessage('Hours: ' + cooldown.hours + '\nMinutes: ' + cooldown.minutes + '\nSeconds: ' + cooldown.seconds, { title: result.command.names[0].upperFirstChar() + ' Cooldown'});
        }
        case patron.CommandError.Exception:
          if (result.error instanceof discord.DiscordAPIError) {
            if (result.error.code === 0 || result.error.code === 404 || result.error.code === 50013) {
              message = 'I do not have permission to do that.';
            } else if (result.error.code === 50007) {
              message = 'I do not have permission to message you. Try allowing DMs from server members.';
            } else if (result.error.code >= 500 && result.error.code < 600) {
              message = 'Houston, we have a problem. Discord internal server errors coming in hot.';
            } else {
              message = result.errorReason;
            }
          } else if (result.error.code === '22P02' || result.error.code === '22003') {
            message = 'An error has occurred due to the use of excessively large numbers.';
          } else {
            message = result.errorReason;
            await Logger.handleError(result.error);
          }
          break;
        case patron.CommandError.InvalidArgCount:
          message = 'You are incorrectly using this command.\n**Usage:** `' + Constants.data.misc.prefix + result.command.getUsage() + '`\n**Example:** `' + Constants.data.misc.prefix + result.command.getExample() + '`';
          break;
        default:
          message = result.errorReason;
          break;
      }

      return msg.tryCreateErrorReply(message);
    }
  })()
    .catch((err) => console.log('Error: ' + err));
});
