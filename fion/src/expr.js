const byte = require('./expr/byte');
const ref = require('./expr/ref');
const call = require('./expr/call');

exports.BYTE = 'BYTE';
exports.REF = 'REF';
exports.CALL = 'CALL';
exports.ref = ref;

exports.create = args => _create(args);

function _create([type, ...args]) {
  switch(type) {
  case exports.BYTE: return { type: exports.BYTE, ...byte.create(...args) };
  case exports.REF: return { type: exports.REF, ...ref.create(...args) };
  case exports.CALL: return { type: exports.CALL, ...call.create(_create, ...args) };
  default: throw `Invalid expression '${type}'`;
  }
}
