const Compiler = require('../src/compiler');

describe('compiler', () => {
  let compiler = null;

  beforeEach(() => {
    compiler = new Compiler();
  });

  it('compiles a program that exits with a constant value', () => {
    const ast = {
      obj: 'def',
      id: '_',
      val: {
        obj: 'fun',
        args: [
          { obj: 'ref', id: '_', type: 'size' },
          { obj: 'ref', id: '_', type: 'char[][]' },
        ],
        body: { obj: 'ref', id: '0', type: 'uint8' },
      },
    };
    const bytecode = compiler.parse(ast);

    expect(bytecode).toBe('exit_i 0x00');
  });
});
