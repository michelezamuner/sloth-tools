const Client = require('./clients/cli');

exports.run = process => {
  return Client.exec(process);
};
