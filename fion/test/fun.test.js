const fun = require('../src/fun');
const stmt = require('../src/stmt');
const expr = require('../src/expr');

describe('fun', () => {
  it('creates function', () => {
    const f = fun.create(['f', [['RET', ['BYTE', 0x00]]]]);

    expect(f).toStrictEqual({
      name: 'f',
      stmts: [{
        type: stmt.RET,
        expr: { type: expr.BYTE, val: Buffer.from([0x00]) },
      }],
    });
  });

  it('errors on function with invalid format', () => {
    expect(() => fun.create([[], []])).toThrow('Invalid function: first element must be function name, found \'[]\'');
    expect(() => fun.create(['f', 'a'])).toThrow('Invalid function: second element must be a list of statements, found \'"a"\'');
  });
});

