const byte = require('./expr/byte');
const ref = require('./expr/ref');
const var_ = require('./expr/var');
const call = require('./expr/call');

exports.BYTE = 'BYTE';
exports.REF = 'REF';
exports.VAR = 'VAR';
exports.CALL = 'CALL';
exports.ref = ref;

exports.create = args => _create(args);

function _create([type, ...args]) {
  if (typeof type !== 'string') {
    throw `Invalid expression: first element must be expression type, found '${JSON.stringify(type)}'`;
  }

  switch(type) {
  case exports.BYTE: return { type: exports.BYTE, ...byte.create(...args) };
  case exports.REF: return { type: exports.REF, ...ref.create(...args) };
  case exports.VAR: return { type: exports.VAR, ...var_.create(...args) };
  case exports.CALL: return { type: exports.CALL, ...call.create(_create, ...args) };
  default: throw `Invalid expression '${type}'`;
  }
}
