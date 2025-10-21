exports.debug = (runtime, ast) => {
  if (ast.elem === 'exp' && ast.var === 'cons') {
    runtime.process.stdout.write(`[${ast.type.name}] ${ast.name}\n`);

    return ast;
  }
};

exports.then = (runtime, ast) => {
  return (runtime, ast) => ast;
};
