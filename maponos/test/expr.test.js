const { compile } = require('../src/expr');
const { expr } = require('fion');
const { parse } = require('fedelm');

describe('expr compiler', () => {
  it('compiles immediate byte', () => {
    const ast = expr.create(['BYTE', 0x12]);

    const bytecode = compile(ast);

    expect(bytecode).toStrictEqual(parse('set_i a 0x00 0x12'));
  });

  it('compiles increment of immediate byte', () => {
    const ast = expr.create(['INCR', ['BYTE', 0x12]]);

    const bytecode = compile(ast);

    expect(bytecode).toStrictEqual(parse(`
      set_i a 0x00 0x12
      incr a
    `));
  });
});
