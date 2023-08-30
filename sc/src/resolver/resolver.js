module.exports = class Resolver {
  constructor(refResolver) {
    this._refResolver = refResolver;
  }

  parse(ast, locals = []) {
    if (ast.obj === 'val') {
      return ast;
    }

    if (ast.obj === 'fun') {
      if (ast.body.obj === 'expr' && ast.body.fun.obj === 'ref') {
        ast.body.fun = this._refResolver.resolve(ast.body.fun, locals);
      }

      return ast;
    }

    const loc = Object.keys(ast);
    for (const id in ast) {
      const def = ast[id];

      ast[id] = this.parse(def, loc);
    }

    return ast;
  }
};
