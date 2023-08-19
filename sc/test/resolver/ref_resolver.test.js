const RefResolver = require('../../src/resolver/ref_resolver');

describe('ref resolver', () => {
  let resolver = null;

  beforeEach(() => {
    resolver = new RefResolver();
  });

  it('resolves native references', () => {
    const ast = { obj: 'ref', ref: 'std.int.add' };

    const result = resolver.resolve(ast);

    expect(result).toStrictEqual({ obj: 'ref', ref: 'std.int.add', loc: 'native' });
  });

  it('resolves local references', () => {
    const ast = { obj: 'ref', ref: 'f' };

    const result = resolver.resolve(ast, ['f']);

    expect(result).toStrictEqual({ obj: 'ref', ref: 'f', loc: 'local' });
  });
});
