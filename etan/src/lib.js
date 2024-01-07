const eval_ = require('./eval');
const file = require('./file');
const repl = require('./repl');

exports.exec = async(process, config) => {
  if (process.argv[2].startsWith('--')) {
    return await execOption(process, config);
  }

  return execFile(process, config);
};

async function execOption(process, config) {
  const option = process.argv[2];
  const code = process.argv[3];

  switch (option) {
  case '--eval': return process.exit(eval_.exec(code, config));
  case '--repl': return await repl.exec(process, config);
  default:
    process.stderr.write(`Invalid option '${option}'\n`);

    return process.exit(1);
  }
}

function execFile(process, config) {
  const f = process.argv[2];

  try {
    return process.exit(file.exec(f, config));
  } catch(e) {
    process.stderr.write(e);

    return process.exit(1);
  }
}
