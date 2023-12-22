const fun = require('../src/fun');
const stmt = require('../src/stmt');
const expr = require('../src/expr');

describe('fun', () => {
  it('creates function definition', () => {
    const f = fun.create('f', { 'RET': [ 'BYTE', 0x00 ] });

    expect(f).toStrictEqual({
      name: 'f',
      stmts: [{
        type: stmt.RET,
        expr: { type: expr.BYTE, val: Buffer.from([0x00]) },
      }],
    });
  });
});
