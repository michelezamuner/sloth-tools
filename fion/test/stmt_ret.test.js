const stmt = require('../src/stmt');

describe('ret', () => {
  it('creates return statement', () => {
    const ret = stmt.create(stmt.RET, 'expr');

    expect(ret).toStrictEqual({
      type: stmt.RET,
      expr: 'expr',
    });
  });
});
