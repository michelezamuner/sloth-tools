module.exports = class Checker {
  constructor(loader) {
    this._loader = loader;
  }

  parse(ast, defs = {}, localDefs = {}) {
    if (ast.obj === 'val') {
      ast.type = parseInt(ast.val) <= 0xff
        ? 'std.uint8.UInt8'
        : 'std.uint16.UInt16'
      ;

      return ast;
    }

    if (ast.obj === 'ref') {
      if (localDefs[ast.ref]) {
        if (localDefs[ast.ref].type) {
          ast.type = localDefs[ast.ref].type;
        }

        return ast;
      }

      let ref = defs[ast.ref];
      if (!ref) {
        ref = this._loader.load(ast.ref);
      }

      if (!ref.type) {
        ref = this.parse(ref, defs, localDefs);
      }

      if (ref.type) {
        ast.type = ref.type;
      }

      return ast;
    }

    if (ast.obj === 'arg') {
      return ast;
    }

    if (ast.obj === 'expr') {
      ast.fun = this.parse(ast.fun, defs, localDefs);
      if (!ast.fun.type) {
        return ast;
      }

      const funTypeParts = ast.fun.type.split('->').map(p => p.trim());
      ast.type = funTypeParts[1];
      const argsTypes = funTypeParts[0].split(' ');

      for (const i in ast.args) {
        const arg = ast.args[i];
        const argType = this.parse(arg, defs, localDefs).type;
        if (!argType) {
          continue;
        }

        arg.type = argType;
        if (arg.type !== argsTypes[i]) {
          throw `Argument ${i} of function ${ast.fun.ref} has type ${arg.type} instead of ${argsTypes[i]}`;
        }
      }

      return ast;
    }

    if (ast.obj === 'fun') {
      const localDefs = ast.args.reduce((acc, arg) => {
        acc[arg.arg] = arg;

        return acc;
      }, {});
      ast.body = this.parse(ast.body, defs, localDefs);

      return ast;
    }

    for (const id in ast) {
      ast[id] = this.parse(ast[id], ast);
    }

    return ast;
  }
};
