const { compile } = require('maponos');
const { memory, run } = require('heber');

exports.run = (code, parse, config) => {
  const ast = parse(code);
  // console.log(JSON.stringify(ast, null, 2));
  const bytecode = compile(ast);
  // console.log(require('fedelm').decode(bytecode));
  const mem = memory.create(config.memory);
  memory.load(mem, bytecode);
  const status = run(mem);

  return status;
};
