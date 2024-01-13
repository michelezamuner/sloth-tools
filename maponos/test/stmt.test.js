const { parse } = require('fedelm');
const { Stmt } = require('fion');

const { compile } = require('../src/stmt');

describe('statement compiler', () => {
  it('compiles return from byte', () => {
    const ast = Stmt.create(['RET', ['BYTE', 0x12]]);

    const bytecode = compile(ast);

    expect(bytecode).toStrictEqual(parse(`
      set_i a 0x00 0x12
      push a
    `));
  });

  it('compiles return from ref', () => {
    const ast = Stmt.create(['RET', ['REF', 'a']]);

    const bytecode = compile(ast);

    expect(bytecode).toStrictEqual(parse('push a'));
  });

  it('compiles return from call', () => {
    const ast = Stmt.create(['RET', ['CALL', ['REF', 'INCR'], ['BYTE', 0x12]]]);

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
    const ast = Stmt.create(['DEC', 'a', ['BYTE', 0x12]]);

    const bytecode = compile(ast);

    expect(bytecode).toStrictEqual(parse(`
      set_i a 0x00 0x12
      set a a
    `));
  });

  it('compiles assignment of byte', () => {
    const ast = Stmt.create(['ASM', ['VAR', 'a'], ['BYTE', 0x12]]);

    const bytecode = compile(ast);

    expect(bytecode).toStrictEqual(parse(`
      set_i a 0x00 0x12
      set a a
    `));
  });

  it('compiles assignment of call', () => {
    const ast = Stmt.create(['ASM', ['VAR', 'a'], ['CALL', ['REF', 'INCR'],['BYTE', 0x12]]]);

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
