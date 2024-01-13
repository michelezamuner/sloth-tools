const { Stmt } = require('fion');

const Asm = require('./stmt/asm');
const Dec = require('./stmt/dec');
const Ret = require('./stmt/ret');

exports.compile = ast => {
  switch(ast.type) {
  case Stmt.RET: return Ret.compile(ast);
  case Stmt.DEC: return Dec.compile(ast);
  case Stmt.ASM: return Asm.compile(ast);
  }
};
