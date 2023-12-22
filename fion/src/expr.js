const byte = require('./expr/byte');
const incr = require('./expr/incr');

exports.BYTE = 'BYTE';
exports.INCR = 'INCR';

exports.create = args => _create(args);

function _create([type, ...args]) {
  switch(type) {
  case exports.BYTE: return { type: exports.BYTE, ...byte.create(...args) };
  case exports.INCR: return { type: exports.INCR, ...incr.create(...args, _create) };
  default: throw `Invalid expression '${type}'`;
  }
}
