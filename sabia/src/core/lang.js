exports.debug = (runtime, [ast]) => {
  if (ast.elem === 'exp') {
    runtime.process.stdout.write(`[${ast.type.id}] ${ast.id}\n`);
  }
};
