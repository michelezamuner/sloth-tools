const { Expr } = require('fion');

const Byte = require('./expr/byte');
const Call = require('./expr/call');


exports.compile = ast => _compile(ast);

function _compile(ast) {
  switch (ast.type) {
  case Expr.BYTE: return Byte.compile(ast);
  case Expr.CALL: return Call.compile(ast, _compile);
  // @todo: handle refs
  case Expr.REF: return null;
  }
}
