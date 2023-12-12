const fun = require('../src/fun');

describe('fun', () => {
  const f = fun.create('main', ['stmt']);

  it('provides function name', () => {
    expect(fun.name(f)).toBe('main');
  });

  it('provides function statements', () => {
    expect(fun.stmts(f)).toStrictEqual(['stmt']);
  });
});
