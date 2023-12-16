const ast = require('../src/ast');
const stmt = require('../src/stmt');
const expr = require('../src/expr');

describe('ast', () => {
  it('creates ast', () => {
    const a = ast.create({
      'f': {'RET': ['REF', '0x00']},
      'g': {'RET': ['REF', '0x00']},
    });

    expect(a).toStrictEqual({
      funs: [
        {
          name: 'f',
          stmts: [
            {
              type: stmt.RET,
              expr: { type: expr.REF, id: '0x00' },
            },
          ],
        },
        {
          name: 'g',
          stmts: [
            {
              type: stmt.RET,
              expr: { type: expr.REF, id: '0x00' },
            },
          ],
        },
      ],
    });
  });
});
