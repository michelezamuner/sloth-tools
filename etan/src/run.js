const { compile } = require('maponos');
const { memory, run } = require('heber');

exports.run = (code, parse, config) => {
  const ast = parse(code);
  const bytecode = compile(ast);
  const mem = memory.create(config.memory);
  memory.load(mem, bytecode);
  const status = run(mem);

  return status;
};
