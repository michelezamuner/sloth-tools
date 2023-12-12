const ast = require('../src/ast');

describe('ast', () => {
  const a = ast.create(['f']);

  it('provides ast functions', () => {
    expect(ast.funs(a)).toStrictEqual(['f']);
  });
});
