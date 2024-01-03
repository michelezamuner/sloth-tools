const { parse } = require('fedelm');

exports.compile = () => {
  return parse(`
    pop a
    incr a
    push a
  `);
};
