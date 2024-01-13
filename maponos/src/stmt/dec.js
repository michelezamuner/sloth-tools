const { parse } = require('fedelm');

const Expr = require('../expr');

// @todo: handle _var
// eslint-disable-next-line no-unused-vars
exports.compile = ({ var: _var, expr: _expr }) => {
  // @todo: works only if _expr is a byte
  return Buffer.concat([
    Expr.compile(_expr),
    parse('set a a'),
  ]);
};
