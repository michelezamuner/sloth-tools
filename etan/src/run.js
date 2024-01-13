const { run } = require('heber');
const { compile } = require('maponos');

exports.run = (code, parse, config) => {
  const { ast: ast } = parse(code);
  // console.log(JSON.stringify(ast, null, 2));
  const bytecode = compile(ast);
  // console.log(require('fedelm').decode(bytecode));
  const status = run(bytecode, config);

  return status;
};
