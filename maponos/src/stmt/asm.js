const { parse } = require('fedelm');
const fion = require('fion');
const expr = require('../expr');

// @todo: handle _var
// eslint-disable-next-line no-unused-vars
exports.compile = ({ var: _var, expr: _expr }) => {
  const elems = [];

  elems.push(expr.compile(_expr));

  // @todo: avoid duplication
  if (_expr.type === fion.expr.CALL) {
    elems.push(parse('pop a'));
  }

  elems.push(parse('set a a'));

  return Buffer.concat(elems);
};
