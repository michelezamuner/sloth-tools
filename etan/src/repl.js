const Readline = require('readline');

const { run } = require('./run');

exports.exec = async(process, parse, config) => {
  const rl = Readline.createInterface({ input: process.stdin, output: process.stdout });

  process.stdout.write('> ');

  let ctx = [];
  const consume = line => {
    const res = parse(line, ctx);
    ctx = res.ctx;

    return res;
  };
  for await(const code of rl) {
    if (code === ':q') {
      rl.close();

      break;
    }

    const result = run(code, consume, config);

    process.stdout.write(`${result}\n`);
    process.stdout.write('> ');
  }
};
