module.exports = class Checker {
  parse(ast) {
    ast.val.val.args[0].type = 'int';
    ast.val.val.args[1].type = 'char[][]';
    ast.val.val.body.type = 'int';

    return ast;
  }
};
