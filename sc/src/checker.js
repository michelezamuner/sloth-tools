module.exports = class Checker {
  parse(ast) {
    ast['_'].args[0].type = 'int';
    ast['_'].args[1].type = 'char[][]';
    ast['_'].body.type = 'int';

    return ast;
  }
};
