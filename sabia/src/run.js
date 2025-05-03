const InlineClient = require('./clients/inline/client');

exports.run = process => {
  if (process.argv[2] === '--inline') {
    const code = process.argv[3];
    const main = process.env.SLOTH_MAIN || '::_::main';
    return InlineClient.exec(code, main);
  }

  return 0;
};
