module.exports = class Checker {
  parse(ast) {
    ast.def.val.args[0].type = 'int';
    ast.def.val.args[1].type = 'char[][]';
    ast.def.val.body.type = 'int';

    return ast;
  }
};
