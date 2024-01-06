const readline = require('readline');
const { stmt } = require('fion');
const { run } = require('./run');

exports.exec = async(process, parse, config) => {
  const consume = createConsume(parse);
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  process.stdout.write('> ');

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

function createConsume(parse) {
  const ctx = [];

  return line => {
    const parsedLine = parse(line);
    const main = parsedLine.funs.find(({ name }) => name === 'main');
    const newCtx = main.stmts.filter(({ type }) => type === stmt.DEC);
    main.stmts.unshift(...ctx);
    ctx.push(...newCtx);

    return parsedLine;
  };
}
