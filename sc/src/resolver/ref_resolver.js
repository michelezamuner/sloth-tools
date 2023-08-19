module.exports = class RefResolver {
  constructor() {
    this._natives = [
      'std.int.add',
    ];
  }

  resolve(ast, locals = []) {
    if (this._natives.includes(ast.ref)) {
      ast.loc = 'native';
    }

    if (locals.includes(ast.ref)) {
      ast.loc = 'local';
    }

    return ast;
  }
};
