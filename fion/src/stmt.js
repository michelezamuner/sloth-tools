const ret = require('./ret');

exports.RET = 'RET';

exports.create = (type, ...args) => {
  switch(type) {
  case exports.RET: return { type: exports.RET, ...ret.create(...args) };
  }
};

exports.type = (stmt) => stmt.type;

exports.ret = ret;
