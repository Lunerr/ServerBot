const patron = require('patron.js');
const path = require('path');
const registry = new patron.Registry({ library: 'discord.js', caseSensitive: false });

(async r => {
  await r.registerGlobalTypeReaders();
  await r.registerLibraryTypeReaders();
  await r.registerArgumentPreconditions(await patron.RequireAll(path.join(__dirname, '../preconditions', 'argument')));
  await r.registerGroups(await patron.RequireAll(path.join(__dirname, '../groups')));
  await r.registerCommands(await patron.RequireAll(path.join(__dirname, '../commands')));
})(registry);

module.exports = registry;
