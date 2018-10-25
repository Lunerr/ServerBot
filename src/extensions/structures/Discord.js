const discord = require('discord.js');
const Random = require('../../utility/Random.js');
const Constants = require('../../utility/Constants.js');

function createMessage(channel, description, options = {}) {
  const embed = new discord.RichEmbed()
    .setColor(options.color !== undefined ? options.color : Random.arrayElement(Constants.data.colors.defaults))
    .setDescription(description);

  if (options.title !== undefined) {
    embed.setTitle(options.title);
  }

  if (options.author !== undefined) {
    embed.setAuthor(options.author.name, options.author.icon, options.author.URL);
  }

  if (options.footer !== undefined) {
    embed.setFooter(options.footer.text, options.footer.icon);
  }

  if (options.timestamp === true) {
    embed.setTimestamp();
  }

  return channel.send({ embed });
}

function createFieldsMessage(channel, fieldsAndValues, inline = true, color = null) {
  const embed = new discord.RichEmbed()
    .setColor(color !== null ? color : Random.arrayElement(Constants.data.colors.defaults));

  for (let i = 0; i < fieldsAndValues.length - 1; i++) {
    if (i.isEven()) {
      embed.addField(fieldsAndValues[i], fieldsAndValues[i + 1], inline);
    }
  }

  return channel.send({ embed });
}

function applyChannelExtensions(structure) {
  structure.prototype.createMessage = function (description, options = {}) {
    return createMessage(this, description, options);
  };

  structure.prototype.createErrorMessage = function (description, options = {}) {
    options.color = Constants.data.colors.error;

    return this.createMessage(description, options);
  };

  structure.prototype.createFieldsMessage = function (fieldsAndValues, inline = true, color = null) {
    return createFieldsMessage(this, fieldsAndValues, inline, color);
  };

  if (structure !== discord.TextChannel) {
    structure.prototype.tryCreateMessage = function (description, options = {}) {
      try {
        this.createMessage(description, options);

        return true;
      } catch (err) {
        return false;
      }
    };
  } else {
    structure.prototype.tryCreateMessage = async function (description, options = {}) {
      const permissions = this.permissionsFor(this.guild.me);

      if (permissions.has('SEND_MESSAGES') === true && permissions.has('EMBED_LINKS') === true) {
        await this.createMessage(description, options);

        return true;
      }

      return false;
    };
  }

  structure.prototype.tryCreateErrorMessage = function (description, options = {}) {
    options.color = Constants.data.colors.error;

    return this.tryCreateMessage(description, options);
  };
}

function applyUserExtensions(structure) {
  structure.prototype.DM = function (description, options = {}) {
    if (options.guild !== undefined) {
      options.footer = { text: options.guild.name, icon: options.guild.iconURL };
    }

    return createMessage(this, description, options);
  };

  structure.prototype.tryDM = async function (description, options = {}) {
    try {
      await this.DM(description, options);

      return true;
    } catch (err) {
      return false;
    }
  };

  structure.prototype.DMFields = function (fieldsAndValues, inline = true, color = null) {
    return createFieldsMessage(this, fieldsAndValues, inline, color);
  };

  structure.prototype.DMError = function (description, options = {}) {
    options.color = Constants.data.colors.error;
    return this.DM(description, options);
  };
}

applyChannelExtensions(discord.TextChannel);
applyChannelExtensions(discord.DMChannel);
applyChannelExtensions(discord.GroupDMChannel);

applyUserExtensions(discord.User);
applyUserExtensions(discord.GuildMember);

discord.Message.prototype.createReply = function (description, options = {}) {
  return this.channel.createMessage(this.author.tag.boldify() + ', ' + description, options);
};

discord.Message.prototype.tryCreateReply = function (description, options = {}) {
  return this.channel.tryCreateMessage(this.author.tag.boldify() + ', ' + description, options);
};

discord.Message.prototype.createErrorReply = function (description, options = {}) {
  return this.channel.createErrorMessage(this.author.tag.boldify() + ', ' + description, options);
};

discord.Message.prototype.tryCreateErrorReply = function (description, options = {}) {
  return this.channel.tryCreateErrorMessage(this.author.tag.boldify() + ', ' + description, options);
};

discord.Message.prototype.sendEmbed = function (commandEmbed, options = {}) {
  const embed = commandEmbed
    .setColor(options.color !== undefined ? options.color : Random.arrayElement(Constants.data.colors.defaults));
  return this.channel.send({ embed: embed });
};

Object.defineProperty(discord.Guild.prototype, 'mainChannel', {
  get: function () {
    const generalChannel = this.channels.find((x) => { 
      x.type === 'text' && (x.name === 'general' || x.name.includes('main'));
    });

    if (generalChannel !== null) {
      return generalChannel;
    }

    return this.channels.filter(x => x.type === 'text').sort((a, b) => a.createdAt - b.createdAt).first();
  }
});

discord.Guild.prototype.getDefaultInvite = async function () {
  const invites = await this.fetchInvites();

  const invite = invites.findValue((v) => v.maxAge === 0 && v.maxUses === 0 && v.temporary === false);

  if (invite !== undefined) {
    return invite;
  }

  const mainChannel = this.mainChannel;

  if (mainChannel !== undefined) {
    return mainChannel.createInvite({ maxAge: 0 });
  }

  return null;
};

discord.Client.prototype.tryDM = async function (id, description, options) {
  try {
    const user = await this.fetchUser(id);

    return user.tryDM(description, options);
  } catch (err) {
    return false;
  }
};
