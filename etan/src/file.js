const fs = require('fs');
const { run } = require('./run');

exports.exec = (file, config) => {
  if (!fs.existsSync(file)) {
    throw `Invalid source file '${file}'\n`;
  }

  const code = fs.readFileSync(file, 'utf-8');

  return run(code, config.parse, { memory: config.memory });
};
