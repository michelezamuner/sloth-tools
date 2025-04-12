exports.debug = (runtime, [ast]) => {
  if (ast.elem === 'exp' && ast.var === 'enum') {
    runtime.process.stdout.write(`[${ast.type.id}] ${ast.body.id}\n`);

    return ast;
  }
};

exports.then = (runtime, [, ast]) => {
  return ast;
};
