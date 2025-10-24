exports.debug = (runtime, ast) => {
  if (ast.var === 'cons') {
    runtime.process.stdout.write(`[${ast.type.name}] ${ast.name}\n`);
  }

  if (ast.var === 'eval') {
    runtime.process.stdout.write(`[${ast.type.name}] ${ast.fun.name} [${ast.arg.type.name}] ${ast.arg.name}\n`);
  }

  return ast;
};

exports.then = (runtime, ast) => {
  return (runtime, ast) => ast;
};
