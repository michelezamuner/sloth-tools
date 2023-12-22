const { compile } = require('../src/lib');
const { ast } = require('fion');
const { parse } = require('fedelm');

describe('maponos', () => {
  it('compiles main function returning a byte', () => {
    const a = ast.create({ 'main': { 'RET': [ 'BYTE', 0x12 ] } });

    const bytecode = compile(a);

    expect(bytecode).toStrictEqual(parse(`
      set_i a 0x00 0x12
      exit a
    `));
  });
});
