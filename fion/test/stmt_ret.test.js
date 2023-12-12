const stmt = require('../src/stmt');

describe('ret', () => {
  it('provides type of statement', () => {
    const ret = stmt.create(stmt.RET, 'expr');

    expect(stmt.type(ret)).toBe(stmt.RET);
  });

  it('provides expression of return statement', () => {
    const ret = stmt.create(stmt.RET, 'expr');

    expect(stmt.ret.expr(ret)).toBe('expr');
  });
});
