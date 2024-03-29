const { parse } = require('fedelm');
const { Ast } = require('fion');

const { compile } = require('../src/lib');

describe('maponos', () => {
  it('compiles main function returning a byte', () => {
    const a = Ast.create([['main', [['RET', [ 'BYTE', 0x12 ]]]]]);

    const bytecode = compile(a);

    expect(bytecode).toStrictEqual(parse(`
      set_i a 0x00 0x12
      push a
      pop a
      exit a
    `));
  });

  it('compiles main function handling a variable', () => {
    const a = Ast.create([['main', [
      ['DEC', 'a', ['BYTE', 0x12]],
      ['ASM', ['VAR', 'a'], ['CALL', ['REF', 'INCR'], ['REF', 'a']]],
      ['RET', ['REF', 'a']]
    ]]]);

    const bytecode = compile(a);

    expect(bytecode).toStrictEqual(parse(`
      set_i a 0x00 0x12
      set a a
      push a
      pop a
      incr a
      push a
      pop a
      set a a
      push a
      pop a
      exit a
    `));
  });
});
