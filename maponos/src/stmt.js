const { stmt } = require('fion');
const ret = require('./stmt/ret');
const dec = require('./stmt/dec');
const asm = require('./stmt/asm');

exports.compile = ast => {
  switch(ast.type) {
  case stmt.RET: return ret.compile(ast);
  case stmt.DEC: return dec.compile(ast);
  case stmt.ASM: return asm.compile(ast);
  }
};
