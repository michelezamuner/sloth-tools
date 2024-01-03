const { parse } = require('fedelm');
const { expr } = require('fion');
const incr = require('./call/incr');

exports.compile = ({ fun: { ref: fun }, args: args }, compile) => {
  const elems = [];
  for (const arg of args) {
    // @todo: handle refs
    const bytecode = compile(arg);
    if (bytecode) {
      elems.push(compile(arg));
    }
    // @todo: avoid duplication
    if (arg.type === expr.CALL) {
      elems.push(parse('pop a'));
    }
    // @todo: should push according to what has been compiled
    elems.push(parse('push a'));
  }
  switch (fun) {
  case 'INCR':
    elems.push(incr.compile());
    break;
  }

  return Buffer.concat(elems);
};
