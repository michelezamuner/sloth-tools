const { compile } = require('maponos');
const { run } = require('heber');

exports.run = (code, parse, config) => {
  const ast = parse(code);
  // console.log(JSON.stringify(ast, null, 2));
  const bytecode = compile(ast);
  // console.log(require('fedelm').decode(bytecode));
  const status = run(bytecode, config);

  return status;
};
