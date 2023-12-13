const ast = require('../src/ast');

describe('ast', () => {
  it('creates ast', () => {
    const a = ast.create(['f']);

    expect(a).toStrictEqual({
      funs: ['f'],
    });
  });
});
