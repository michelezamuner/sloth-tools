const evalApp = (app, ctx) => {
  if (!app.rel.obj) {
    return ctx[app.rel][app.arg];
  }

  if (app.rel.obj === 'rel') {
    return app.rel.rel[app.arg];
  }

  const rel = run([app.rel], ctx);

  return rel.rel[app.arg];
};

const run = (ast, ctx = {}) => {
  let result = null;
  let lastExpr = null;

  for (const expr of ast) {
    if (expr.obj === 'rel') {
      ctx[expr.id] = expr.rel;
    }
    if (expr.obj === 'app') {
      result = evalApp(expr, ctx);
    }
    lastExpr = expr;
  }

  return result || lastExpr;
};

module.exports = {
  run: run,
};
