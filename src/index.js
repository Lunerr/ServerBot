const path = require('path');
const patron = require('patron.js');
const Logger = require('./utility/Logger.js');

require('dotenv').config();

(async () => {
  await require('./extensions');

  const client = require('./structures/Client.js');

  await patron.RequireAll(path.join(__dirname, 'events'));

  await client.db.connect(process.env.MONGO_DB_URL);
  await client.login('NTEzNzA0OTQzNTA1Mzc1MjMz.DtMXUw.k3oBzZ3lXUgmndy_SUYceUySBRo');
})()
  .catch(e => Logger.handleError(e));

process.on('unhandledRejection', e => Logger.handleError(e));
