module.exports = class Checker {
  parse(ast) {
    ast.val.args[0].type = 'size';
    ast.val.args[1].type = 'char[][]';
    ast.val.body.type = 'uint8';

    return ast;
  }
};
