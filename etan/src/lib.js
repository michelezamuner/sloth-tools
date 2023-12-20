const { run } = require('./run');
const fs = require('fs');

exports.exec = (process, parse, config) => {
  if (process.argv[2].startsWith('--')) {
    return execOption(process, parse, config);
  }

  return execFile(process, parse, config);
};

function execOption(process, parse, config) {
  const option = process.argv[2];
  const value = process.argv[3];

  switch (option) {
  case '--eval': {
    const status = run(value, parse, config);

    return process.exit(status);
  }
  default:
    process.stderr.write(`Invalid option '${option}'\n`);

    return process.exit(1);
  }
}

function execFile(process, parse, config) {
  const file = process.argv[2];
  if (!fs.existsSync(file)) {
    process.stderr.write(`Invalid source file '${file}'\n`);

    return process.exit(1);
  }

  const code = fs.readFileSync(file, 'utf-8');
  const status = run(code, parse, config);

  return process.exit(status);
}
