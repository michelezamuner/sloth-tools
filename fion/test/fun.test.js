const fun = require('../src/fun');

describe('fun', () => {
  it('creates function definition', () => {
    const f = fun.create('main', ['stmt']);

    expect(f).toStrictEqual({
      name: 'main',
      stmts: ['stmt'],
    });
  });
});
