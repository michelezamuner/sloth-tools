const ctx = {};

const run = ast => {
  if (!Array.isArray(ast)) {
    return ast;
  }

  for (const expr of ast) {
    if (expr.obj === 'rel') {
      ctx[expr.id] = expr;
    }
    if (expr.obj === 'app') {
      const rel = ctx[expr.rel];

      return rel.val;
    }
  }
};

module.exports = {
  run: run,
};
