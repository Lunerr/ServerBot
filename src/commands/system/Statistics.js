const patron = require('patron.js');
const NumberUtil = require('../../utility/NumberUtil.js');
const Constants = require('../../utility/Constants.js');

class Statistics extends patron.Command {
  constructor() {
    super({
      names: ['statistics', 'stats'],
      groupName: 'system',
      description: 'Statistics about this bot.',
      guildOnly: false
    });
  }

  async run(msg, args) {
    const uptime = NumberUtil.msToTime(msg.client.uptime);

    let users = 0;

    for (const guild of msg.client.guilds.values()) {
      users += guild.memberCount;
    }

    await msg.author.DMFields(
      [
        'Author', 'Luner#0059\ncryptoRG#2162', 'Framework', 'patron.js', 'Memory', (process.memoryUsage().rss / 1048576).toFixed(2) + ' MB', 'Servers', msg.client.guilds.size,
        'Users', users, 'Uptime', 'Days: ' + uptime.days + '\nHours: '+ uptime.hours + '\nMinutes: ' + uptime.minutes
      ]);

    if (msg.channel.type !== 'dm') {
      return msg.createReply('You have been DMed with all ' + msg.client.user.username + ' Statistics!');
    }
  }
}

module.exports = new Statistics();
