const { compile } = require('../src/stmt');
const { stmt } = require('fion');
const { parse } = require('fedelm');

describe('statement compiler', () => {
  it('compiles return from byte', () => {
    const ast = stmt.create(['RET', ['BYTE', 0x12]]);

    const bytecode = compile(ast);

    expect(bytecode).toStrictEqual(parse(`
      set_i a 0x00 0x12
      push a
    `));
  });

  it('compiles return from ref', () => {
    const ast = stmt.create(['RET', ['REF', 'a']]);

    const bytecode = compile(ast);

    expect(bytecode).toStrictEqual(parse('push a'));
  });

  it('compiles return from call', () => {
    const ast = stmt.create(['RET', ['CALL', ['REF', 'INCR'], ['BYTE', 0x12]]]);

    const bytecode = compile(ast);

    expect(bytecode).toStrictEqual(parse(`
      set_i a 0x00 0x12
      push a
      pop a
      incr a
      push a
      pop a
      push a
    `));
  });

  it('compiles declaration', () => {
    const ast = stmt.create(['DEC', 'a', ['BYTE', 0x12]]);

    const bytecode = compile(ast);

    expect(bytecode).toStrictEqual(parse(`
      set_i a 0x00 0x12
      set a a
    `));
  });

  it('compiles assignment of byte', () => {
    const ast = stmt.create(['ASM', ['VAR', 'a'], ['BYTE', 0x12]]);

    const bytecode = compile(ast);

    expect(bytecode).toStrictEqual(parse(`
      set_i a 0x00 0x12
      set a a
    `));
  });

  it('compiles assignment of call', () => {
    const ast = stmt.create(['ASM', ['VAR', 'a'], ['CALL', ['REF', 'INCR'],['BYTE', 0x12]]]);

    const bytecode = compile(ast);

    expect(bytecode).toStrictEqual(parse(`
      set_i a 0x00 0x12
      push a
      pop a
      incr a
      push a
      pop a
      set a a
    `));
  });
});
