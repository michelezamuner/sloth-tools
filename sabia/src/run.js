const Inline = require('./clients/inline');

exports.run = process => {
  if (process.argv[2] === '--inline') {
    const code = process.argv[3];
    const main = process.env.SLOTH_MAIN || '::_::main';
    return Inline.exec(code, main);
  }

  return 0;
};
