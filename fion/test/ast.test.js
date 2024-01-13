const Ast = require('../src/ast');
const Expr = require('../src/expr');
const Stmt = require('../src/stmt');


describe('ast', () => {
  it('creates ast', () => {
    const ast = Ast.create([
      ['f', [['RET', ['BYTE', 0x00]]]],
      ['g', [['RET', ['BYTE', 0x00]]]],
    ]);

    expect(ast).toStrictEqual({
      funs: [
        {
          name: 'f',
          stmts: [
            {
              type: Stmt.RET,
              expr: { type: Expr.BYTE, val: Buffer.from([0x00]) },
            },
          ],
        },
        {
          name: 'g',
          stmts: [
            {
              type: Stmt.RET,
              expr: { type: Expr.BYTE, val: Buffer.from([0x00]) },
            },
          ],
        },
      ],
    });
  });

  it('errors on ast with invalid format', () => {
    expect(() => Ast.create('a')).toThrow('Invalid ast: must be a list of functions, found \'"a"\'');
  });
});
