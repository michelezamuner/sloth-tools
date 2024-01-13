const Fs = require('fs');

const { run } = require('./run');

exports.exec = (file, parse, config) => {
  if (!Fs.existsSync(file)) {
    throw `Invalid source file '${file}'\n`;
  }

  const code = Fs.readFileSync(file, 'utf-8');

  return run(code, parse, config);
};
