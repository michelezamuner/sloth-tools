const Compiler = require('../src/compiler');

describe('compiler', () => {
  let compiler = null;

  beforeEach(() => {
    compiler = new Compiler();
  });

  it('compiles program that exits with a constant value', () => {
    const ast = {
      obj: 'def',
      id: '_',
      val: {
        obj: 'val',
        val: {
          args: [
            { obj: 'ref', id: '_', type: 'int' },
            { obj: 'ref', id: '_', type: 'char[][]' },
          ],
          body: { obj: 'val', val: '0', type: 'int' },
        }
      },
    };
    const bytecode = compiler.parse(ast);

    expect(bytecode).toBe('exit_i 0x00');
  });

  it('compiles program calling native function', () => {
    const ast = {
      obj: 'def',
      id: '_',
      val: {
        obj: 'val',
        val: {
          args: [
            { obj: 'ref', id: '_', type: 'int' },
            { obj: 'ref', id: '_', type: 'char[][]' },
          ],
          body: {
            obj: 'expr',
            fun: { obj: 'ref', id: 'std.int.add', type: 'int int -> int' },
            args: [
              { obj: 'val', val: '1', type: 'int' },
              { obj: 'val', val: '1', type: 'int' },
            ],
          },
        },
      },
    };

    const bytecode = compiler.parse(ast);

    expect(bytecode).toBe(`
      push_i 0x00 0x01
      push_i 0x00 0x01
      nat_i 0x00 0x0e 0x0b
      pop a
      exit_r a
      0x73 0x74 0x64 0x2e 0x69 0x6e 0x74 0x2e 0x61 0x64 0x64
    `.split('\n').map(l => l.trim()).join('\n').trim());
  });
});
