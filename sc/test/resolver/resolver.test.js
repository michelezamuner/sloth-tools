const Resolver = require('../../src/resolver/resolver');

describe('resolver', () => {
  let resolver = null;
  const refResolver = {};

  beforeEach(() => {
    resolver = new Resolver(refResolver);
  });

  it('resolves single value', () => {
    const ast = {
      'v': { obj: 'val', val: '0' },
    };

    const result = resolver.parse(ast);

    expect(result).toStrictEqual({
      'v': { obj: 'val', val: '0' },
    });
  });

  it('resolves function returning value', () => {
    const ast = {
      '_': {
        obj: 'fun',
        args: [
          { obj: 'arg', arg: '_' },
          { obj: 'arg', arg: '_' },
        ],
        body: { obj: 'val', val: '0' },
      },
    };

    const result = resolver.parse(ast);

    expect(result).toStrictEqual({
      '_': {
        obj: 'fun',
        args: [
          { obj: 'arg', arg: '_' },
          { obj: 'arg', arg: '_' },
        ],
        body: { obj: 'val', val: '0' },
      },
    });
  });

  it('resolves function calling function reference', () => {
    const ast = {
      '_': {
        obj: 'fun',
        args: [
          { obj: 'arg', arg: '_' },
          { obj: 'arg', arg: '_' },
        ],
        body: {
          obj: 'expr',
          fun: { obj: 'ref', ref: 'ref' },
          args: [
            { obj: 'val', val: '1' },
            { obj: 'val', val: '2' },
          ],
        },
      },
    };
    refResolver.resolve = (_ref, _loc) => _ref.ref === 'ref' && JSON.stringify(_loc) === JSON.stringify(['_']) ? 'resolved' : null;

    const result = resolver.parse(ast);

    expect(result).toStrictEqual({
      '_': {
        obj: 'fun',
        args: [
          { obj: 'arg', arg: '_' },
          { obj: 'arg', arg: '_' },
        ],
        body: {
          obj: 'expr',
          fun: 'resolved',
          args: [
            { obj: 'val', val: '1' },
            { obj: 'val', val: '2' },
          ],
        },
      },
    });
  });
});
