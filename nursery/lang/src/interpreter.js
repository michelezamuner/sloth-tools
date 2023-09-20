const run = ast => {
  if (!Array.isArray(ast)) {
    return ast;
  }

  const ctx = {};
  let result = null;

  for (const expr of ast) {
    if (expr.obj === 'rel') {
      ctx[expr.id] = expr.rel;
    }
    if (expr.obj === 'app') {
      result = ctx[expr.rel][expr.arg];
    }
  }

  return result;
};

module.exports = {
  run: run,
};
