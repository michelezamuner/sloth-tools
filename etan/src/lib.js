const { run } = require('./run');
const fs = require('fs');
const readline = require('readline');

exports.exec = async(process, parse, config) => {
  if (process.argv[2].startsWith('--')) {
    return await execOption(process, parse, config);
  }

  return execFile(process, parse, config);
};

async function execOption(process, parse, config) {
  const option = process.argv[2];
  const value = process.argv[3];

  switch (option) {
  case '--eval': {
    const status = run(value, parse, config);

    return process.exit(status);
  }
  case '--repl': {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    process.stdout.write('> ');
    for await(const code of rl) {
      if (code === ':q') {
        rl.close();
        break;
      }
      const result = run(code, parse, config);
      process.stdout.write(`${result}\n`);
      process.stdout.write('> ');
    }
    break;
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
