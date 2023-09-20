const ctx = {};

const run = ast => {
  if (!Array.isArray(ast)) {
    return ast;
  }

  let result = null;

  for (const expr of ast) {
    if (expr.obj === 'rel') {
      if (!ctx[expr.id]) {
        ctx[expr.id] = {};
      }
      ctx[expr.id][expr.arg] = expr.val;
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
