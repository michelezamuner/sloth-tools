const Byte = require('./expr/byte');
const Call = require('./expr/call');
const Ref = require('./expr/ref');
const Var = require('./expr/var');

exports.BYTE = 'BYTE';
exports.CALL = 'CALL';
exports.REF = 'REF';
exports.VAR = 'VAR';

exports.ref = Ref;

exports.create = args => _create(args);

function _create([type, ...args]) {
  if (typeof type !== 'string') {
    throw `Invalid expression: first element must be expression type, found '${JSON.stringify(type)}'`;
  }

  switch(type) {
  case exports.BYTE: return { type: exports.BYTE, ...Byte.create(...args) };
  case exports.CALL: return { type: exports.CALL, ...Call.create(_create, ...args) };
  case exports.REF: return { type: exports.REF, ...Ref.create(...args) };
  case exports.VAR: return { type: exports.VAR, ...Var.create(...args) };
  default: throw `Invalid expression '${type}'`;
  }
}
