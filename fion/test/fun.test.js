const Expr = require('../src/expr');
const Fun = require('../src/fun');
const Stmt = require('../src/stmt');

describe('fun', () => {
  it('creates function', () => {
    const fun = Fun.create(['f', [['RET', ['BYTE', 0x00]]]]);

    expect(fun).toStrictEqual({
      name: 'f',
      stmts: [{
        type: Stmt.RET,
        expr: { type: Expr.BYTE, val: Buffer.from([0x00]) },
      }],
    });
  });

  it('errors on function with invalid format', () => {
    expect(() => Fun.create([[], []])).toThrow('Invalid function: first element must be function name, found \'[]\'');
    expect(() => Fun.create(['f', 'a'])).toThrow('Invalid function: second element must be a list of statements, found \'"a"\'');
  });
});

