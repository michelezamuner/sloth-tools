const fion = require('../src/lib');

describe('fion', () => {
  it('generates an AST representing a function returning a constant value', () => {
    const astRef = fion.expr.create(fion.expr.REF, '0');
    const astRet = fion.stmt.create(fion.stmt.RET, astRef);
    const astFun = fion.fun.create('main', [astRet]);
    const ast = fion.ast.create([astFun]);

    expect(fion.json(ast)).toStrictEqual({
      funs: [
        {
          name: 'main',
          stmts: [
            {
              type: fion.stmt.RET,
              expr: { type: fion.expr.REF, id: '0' },
            },
          ],
        },
      ],
    });
  });
});
