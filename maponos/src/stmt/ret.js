const { parse } = require('fedelm');
const fion = require('fion');
const expr = require('../expr');

exports.compile = ({ expr: _expr }) => {
  const elems = [];

  // @todo: avoid duplication
  if (_expr.type !== fion.expr.REF) {
    elems.push(expr.compile(_expr));
  }

  // @todo: avoid duplication
  if (_expr.type === fion.expr.CALL) {
    elems.push(parse('pop a'));
  }

  elems.push(parse('push a'));

  return Buffer.concat(elems);
};
