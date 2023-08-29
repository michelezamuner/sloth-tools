const Compiler = require('../src/compiler');

describe('compiler', () => {
  let compiler = null;

  beforeEach(() => {
    compiler = new Compiler();
  });

  it('compiles program returning constant value', () => {
    const ast = {
      '_': {
        obj: 'val',
        val: {
          args: [
            { obj: 'arg', arg: '_' },
            { obj: 'arg', arg: '_' },
          ],
          body: { obj: 'val', val: '0' },
        }
      },
    };
    const bytecode = compiler.parse(ast);

    expect(bytecode).toBe(`
      ; _
      pop a
      push_i 0x00 0x00
      jmp_r a
    `.split('\n').map(l => l.trim()).join('\n').trim());
  });

  it('compiles program referencing local value', () => {
    const ast = {
      '_': {
        obj: 'val',
        val: {
          args: [
            { obj: 'arg', arg: '_', type: 'int' },
            { obj: 'arg', arg: '_', type: 'char[][]' },
          ],
          body: { obj: 'ref', ref: 'v' },
        },
      },
      'v': { obj: 'val', val: '2' },
    };

    const bytecode = compiler.parse(ast);

    expect(bytecode).toBe(`
      ; _
      pop a
      read_i b #{v}
      push_r b
      jmp_r a
      ; v
      0x00 0x02
    `.split('\n').map(l => l.trim()).join('\n').trim());
  });

  it('compiles program calling native function', () => {
    const ast = {
      '_': {
        obj: 'val',
        val: {
          args: [
            { obj: 'arg', arg: '_' },
            { obj: 'arg', arg: '_' },
          ],
          body: {
            obj: 'expr',
            fun: { obj: 'ref', ref: 'std.int.add', loc: 'native' },
            args: [
              { obj: 'val', val: '1' },
              { obj: 'val', val: '1' },
            ],
          },
        },
      },
    };

    const bytecode = compiler.parse(ast);

    expect(bytecode).toBe(`
      ; _
      push_i 0x00 0x01
      push_i 0x00 0x01
      nat_i 0x10
      pop a
      pop b
      push_r a
      jmp_r b
    `.split('\n').map(l => l.trim()).join('\n').trim());
  });

  it('compiles program calling local function', () => {
    const ast = {
      '_': {
        obj: 'val',
        val: {
          args: [
            { obj: 'arg', arg: '_' },
            { obj: 'arg', arg: '_' },
          ],
          body: {
            obj: 'expr',
            fun: { obj: 'ref', ref: 'f', loc: 'local' },
            args: [
              { obj: 'val', val: '1' },
              { obj: 'val', val: '2' },
            ],
          },
        },
      },
      'f': {
        obj: 'val',
        val: {
          args: [
            { obj: 'arg', arg: 'b' },
            { obj: 'arg', arg: 'a' },
          ],
          body: {
            obj: 'expr',
            fun: { obj: 'ref', ref: 'std.int.add', loc: 'native' },
            args: [
              { obj: 'ref', ref: 'a' },
              { obj: 'ref', ref: 'b' },
            ],
          },
        },
      },
    };

    const bytecode = compiler.parse(ast);

    expect(bytecode).toBe(`
      ; _
      push_i #{_+12}
      push_i 0x00 0x01
      push_i 0x00 0x02
      jmp_i #{f}
      pop a
      pop b
      push_r a
      jmp_r b
      ; f
      pop a
      pop b
      push_r a
      push_r b
      nat_i 0x10
      pop a
      pop b
      push_r a
      jmp_r b
    `.split('\n').map(l => l.trim()).join('\n').trim());
  });

  it('compiles program referencing multiple local functions and values', () => {
    const ast = {
      '_': {
        obj: 'val',
        val: {
          args: [
            { obj: 'arg', arg: '_' },
            { obj: 'arg', arg: '_' },
          ],
          body: {
            obj: 'expr',
            fun: { obj: 'ref', ref: 'f1', loc: 'local' },
            args: [
              { obj: 'ref', ref: 'a' },
              { obj: 'ref', ref: 'b' },
            ],
          },
        },
      },
      'f1': {
        obj: 'val',
        val: {
          args: [
            { obj: 'arg', arg: 'a' },
            { obj: 'arg', arg: 'b' },
          ],
          body: {
            obj: 'expr',
            fun: { obj: 'ref', ref: 'f2', loc: 'local' },
            args: [
              { obj: 'ref', ref: 'a' },
              { obj: 'ref', ref: 'b' },
            ],
          },
        },
      },
      'f2': {
        obj: 'val',
        val: {
          args: [
            { obj: 'arg', arg: 'b' },
            { obj: 'arg', arg: 'a' },
          ],
          body: {
            obj: 'expr',
            fun: { obj: 'ref', ref: 'std.int.add', loc: 'native' },
            args: [
              { obj: 'ref', ref: 'a' },
              { obj: 'ref', ref: 'b' },
            ],
          },
        },
      },
      'a': { obj: 'val', val: '1' },
      'b': { obj: 'val', val: '2' },
    };

    const bytecode = compiler.parse(ast);

    expect(bytecode).toBe(`
      ; _
      push_i #{_+18}
      read_i a #{a}
      push_r a
      read_i a #{b}
      push_r a
      jmp_i #{f1}
      pop a
      pop b
      push_r a
      jmp_r b
      ; f1
      pop a
      pop b
      push_i #{f1+14}
      push_r b
      push_r a
      jmp_i #{f2}
      pop a
      pop b
      push_r a
      jmp_r b
      ; f2
      pop a
      pop b
      push_r a
      push_r b
      nat_i 0x10
      pop a
      pop b
      push_r a
      jmp_r b
      ; a
      0x00 0x01
      ; b
      0x00 0x02
    `.split('\n').map(l => l.trim()).join('\n').trim());
  });

  it('compiles library that exports type definitions', () => {
    const ast = {
      't': { obj: 'type', type: 'v' },
      'u': { obj: 'type', type: 'w' },
    };

    const bytecode = compiler.parse(ast);

    expect(bytecode).toBe(`
      ; t :: v
      ; u :: w
    `.split('\n').map(l => l.trim()).join('\n').trim());
  });
});
