const { expr } = require('fion');
const byte = require('./expr/byte');
const call = require('./expr/call');


exports.compile = ast => _compile(ast);

function _compile(ast) {
  switch (ast.type) {
  case expr.BYTE: return byte.compile(ast);
  case expr.CALL: return call.compile(ast, _compile);
  // @todo: handle refs
  case expr.REF: return null;
  }
}
