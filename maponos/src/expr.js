const { expr } = require('fion');
const { parse } = require('fedelm');

exports.compile = ast => _compile(ast);

function _compile(ast) {
  switch (ast.type) {
  case expr.BYTE: return parse(`set_i a 0x00 ${ast.val.readUInt8()}`);
  case expr.INCR: return Buffer.concat([_compile(ast.expr), parse('incr a')]);
  }
}
