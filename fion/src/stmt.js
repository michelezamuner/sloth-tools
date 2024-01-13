const Asm = require('./stmt/asm');
// @todo change this to 'dcl', because it looks like "decrement"
const Dec = require('./stmt/dec');
const Ret = require('./stmt/ret');

exports.ASM = 'ASM';
exports.DEC = 'DEC';
exports.RET = 'RET';

exports.create = def => {
  if (def.type) {
    return def;
  }

  const [type, ...args] = def;
  if (typeof type !== 'string') {
    throw `Invalid statement: first element must be statement type, found '${JSON.stringify(type)}'`;
  }

  switch(type) {
  case exports.ASM: return { type: exports.ASM, ...Asm.create(...args) };
  case exports.DEC: return { type: exports.DEC, ...Dec.create(...args) };
  case exports.RET: return { type: exports.RET, ...Ret.create(...args) };
  default: throw `Invalid statement '${type}'`;
  }
};
