const { compile } = require('../src/expr');
const { expr } = require('fion');
const { parse } = require('fedelm');

describe('expr compiler', () => {
  // @todo: return usage instructions: this can be optimized
  it('compiles immediate byte', () => {
    const ast = expr.create(['BYTE', 0x12]);

    const bytecode = compile(ast);

    expect(bytecode).toStrictEqual(parse('set_i a 0x00 0x12'));
  });

  // @todo: return usage instructions: this can be optimized
  it('compiles call to native function incr', () => {
    const ast = expr.create(['CALL', ['REF', 'INCR'], ['BYTE', 0x12]]);

    const bytecode = compile(ast);

    expect(bytecode).toStrictEqual(parse(`
      set_i a 0x00 0x12
      incr a
    `));
  });
});
