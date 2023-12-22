const stmt = require('../src/stmt');
const expr = require('../src/expr');

describe('ret', () => {
  it('creates return statement from dsl', () => {
    const ret = stmt.create('RET', ['BYTE', 0x12]);

    expect(ret).toStrictEqual({
      type: stmt.RET,
      expr: { type: expr.BYTE, val: Buffer.from([0x12]) },
    });
  });

  it('creates return statement from ast', () => {
    const ref = expr.create(['BYTE', 0x12]);
    const ret = stmt.create('RET', ref);

    expect(ret).toStrictEqual({
      type: stmt.RET,
      expr: { type: expr.BYTE, val: Buffer.from([0x12]) },
    });
  });
});
