const eval_ = require('./eval');
const file = require('./file');
const repl = require('./repl');

exports.exec = async(process, parse, config) => {
  if (process.argv[2].startsWith('--')) {
    return await execOption(process, parse, config);
  }

  return execFile(process, parse, config);
};

async function execOption(process, parse, config) {
  const option = process.argv[2];
  const code = process.argv[3];

  switch (option) {
  case '--eval': return process.exit(eval_.exec(code, parse, config));
  case '--repl': return await repl.exec(process, parse, config);
  default:
    process.stderr.write(`Invalid option '${option}'\n`);

    return process.exit(1);
  }
}

function execFile(process, parse, config) {
  const f = process.argv[2];

  try {
    return process.exit(file.exec(f, parse, config));
  } catch(e) {
    process.stderr.write(e);

    return process.exit(1);
  }
}
