const ast = require('../src/ast');
const stmt = require('../src/stmt');
const expr = require('../src/expr');

describe('ast', () => {
  it('creates ast', () => {
    const a = ast.create({
      'f': {'RET': ['BYTE', 0x00]},
      'g': {'RET': ['BYTE', 0x00]},
    });

    expect(a).toStrictEqual({
      funs: [
        {
          name: 'f',
          stmts: [
            {
              type: stmt.RET,
              expr: { type: expr.BYTE, val: Buffer.from([0x00]) },
            },
          ],
        },
        {
          name: 'g',
          stmts: [
            {
              type: stmt.RET,
              expr: { type: expr.BYTE, val: Buffer.from([0x00]) },
            },
          ],
        },
      ],
    });
  });
});
