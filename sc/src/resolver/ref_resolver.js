const natives = require('../natives.json');

module.exports = class RefResolver {
  resolve(ast, locals = []) {
    if (natives[ast.ref]) {
      ast.loc = 'native';
    }

    if (locals.includes(ast.ref)) {
      ast.loc = 'local';
    }

    return ast;
  }
};
