const ref = require('./ref');

exports.REF = 'REF';

exports.create = (type, ...args) => {
  switch(type) {
  case exports.REF: return { type: exports.REF, ...ref.create(...args) };
  }
};

exports.type = (expr) => expr.type;

exports.ref = ref;
