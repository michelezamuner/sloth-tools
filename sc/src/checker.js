module.exports = class Checker {
  parse(ast) {
    ast['_'].val.args[0].type = 'int';
    ast['_'].val.args[1].type = 'char[][]';
    ast['_'].val.body.type = 'int';

    return ast;
  }
};
