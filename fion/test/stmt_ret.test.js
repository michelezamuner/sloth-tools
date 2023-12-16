const stmt = require('../src/stmt');
const expr = require('../src/expr');

describe('ret', () => {
  it('creates return statement', () => {
    const ret = stmt.create('RET', ['REF', '0x00']);

    expect(ret).toStrictEqual({
      type: stmt.RET,
      expr: { type: expr.REF, id: '0x00' },
    });
  });
});
