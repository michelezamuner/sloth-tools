const ret = require('./stmt/ret');
// @todo change this to 'dcl', because it looks like "decrement"
const dec = require('./stmt/dec');
const asm = require('./stmt/asm');

exports.RET = 'RET';
exports.DEC = 'DEC';
exports.ASM = 'ASM';

exports.create = def => {
  if (def.type) {
    return def;
  }

  const [type, ...args] = def;

  switch(type) {
  case exports.RET: return { type: exports.RET, ...ret.create(...args) };
  case exports.DEC: return { type: exports.DEC, ...dec.create(...args) };
  case exports.ASM: return { type: exports.ASM, ...asm.create(...args) };
  default: throw `Invalid statement '${type}'`;
  }
};
