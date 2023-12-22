const ret = require('./stmt/ret');

exports.RET = 'RET';

exports.create = (type, ...args) => {
  switch(type) {
  case exports.RET: return { type: exports.RET, ...ret.create(...args) };
  }
};
