const readline = require('readline');
const { run } = require('./run');

exports.exec = async(process, config) => {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  process.stdout.write('> ');

  let ctx = [];
  const parse = code => {
    const ast = config.parse(code);
    const { ast: a, ctx: c } = config.consume(ast, ctx);
    ctx = c;

    return a;
  };
  for await(const code of rl) {
    if (code === ':q') {
      rl.close();

      break;
    }

    const result = run(code, parse, config);

    process.stdout.write(`${result}\n`);
    process.stdout.write('> ');
  }
};
