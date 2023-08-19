const Compiler = require('../src/compiler');

describe('compiler', () => {
  let compiler = null;

  beforeEach(() => {
    compiler = new Compiler();
  });

  it('compiles program that exits with a constant value', () => {
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
      nat_i #{_+18} 0x0b
      pop a
      pop b
      push_r a
      jmp_r b
      0x73 0x74 0x64 0x2e 0x69 0x6e 0x74 0x2e 0x61 0x64 0x64
    `.split('\n').map(l => l.trim()).join('\n').trim());
  });

  it('compiles program that references local value', () => {
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
      read_i b #{_+10}
      push_r b
      jmp_r a
      ; v
      0x00 0x02
    `.split('\n').map(l => l.trim()).join('\n').trim());
  });

  it('compiles program that calls local function', () => {
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
      nat_i #{f+20} 0x0b
      pop a
      pop b
      push_r a
      jmp_r b
      0x73 0x74 0x64 0x2e 0x69 0x6e 0x74 0x2e 0x61 0x64 0x64
    `.split('\n').map(l => l.trim()).join('\n').trim());
  });
});
