const Resolver = require('../../src/resolver/resolver');

describe('resolver', () => {
  let resolver = null;
  const refResolver = {};

  beforeEach(() => {
    resolver = new Resolver(refResolver);
  });

  it('resolves function reference', () => {
    const ast = {
      '_': {
        obj: 'val',
        val: {
          args: [
            { obj: 'arg', arg: '_' },
            { obj: 'arg', arg: '_' },
          ],
          body: {
            fun: { obj: 'ref', ref: 'ref' },
            args: [
              { obj: 'val', val: '1' },
              { obj: 'val', val: '2' },
            ],
          },
        },
      },
    };
    refResolver.resolve = (_ref, _loc) => _ref.ref === 'ref' && JSON.stringify(_loc) === JSON.stringify(['_']) ? 'resolved' : null;

    const result = resolver.parse(ast);

    expect(result).toStrictEqual({
      '_': {
        obj: 'val',
        val: {
          args: [
            { obj: 'arg', arg: '_' },
            { obj: 'arg', arg: '_' },
          ],
          body: {
            fun: 'resolved',
            args: [
              { obj: 'val', val: '1' },
              { obj: 'val', val: '2' },
            ],
          },
        },
      },
    });
  });
});
