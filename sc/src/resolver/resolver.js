module.exports = class Resolver {
  constructor(refResolver) {
    this._refResolver = refResolver;
  }

  parse(ast, locals = []) {
    if (ast.obj === 'val') {
      if (ast.val.body && ast.val.body.fun && ast.val.body.fun.obj === 'ref') {
        ast.val.body.fun = this._refResolver.resolve(ast.val.body.fun, locals);
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
