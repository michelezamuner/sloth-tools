const parse = require('../src/parser').parse;

describe('parser', () => {
  it('parses single relation', () => {
    const tokens = ['rel', 'a', 'of', ':b', 'is', ':c'];

    const ast = parse(tokens);

    expect(ast).toStrictEqual([{
      obj: 'rel',
      id: 'a',
      rel: { ':b': ':c'},
    }]);
  });

  it('parses anonymous relation', () => {
    const tokens = ['rel', 'of', ':b', 'is', ':c'];

    const ast = parse(tokens);

    expect(ast).toStrictEqual([{
      obj: 'rel',
      rel: { ':b': ':c'},
    }]);
  });

  it('parses application', () => {
    const tokens = ['a', 'of', ':b'];

    const ast = parse(tokens);

    expect(ast).toStrictEqual([{
      obj: 'app',
      rel: 'a',
      arg: ':b',
    }]);
  });

  it('parses multiple expressions', () => {
    const tokens = ['rel', 'of', ':a', 'is', ':b', ';', 'rel', 'of', ':c', 'is', ':d', ';', 'a', 'of', ':b'];

    const ast = parse(tokens);

    expect(ast).toStrictEqual([
      {
        obj: 'rel',
        rel: { ':a': ':b'},
      },
      {
        obj: 'rel',
        rel: { ':c': ':d'},
      },
      {
        obj: 'app',
        rel: 'a',
        arg: ':b',
      },
    ]);
  });

  it('parses application of anonymous relation', () => {
    const tokens = ['(', 'rel', 'of', ':b', 'is', ':c', ')', 'of', ':b'];

    const ast = parse(tokens);

    expect(ast).toStrictEqual([{
      obj: 'app',
      rel: {
        obj: 'rel',
        rel: { ':b': ':c' },
      },
      arg: ':b',
    }]);
  });

  it('prevents from defining multiple relations with the same name', () => {
    const tokens = ['rel', 'a', 'of', ':b', 'is', ':c', ';', 'rel', 'a', 'of', ':c', 'is', ':d'];

    expect(() => parse(tokens)).toThrow('Relation `a` is already defined');
  });

  it('parses compound applications', () => {
    const tokens = ['(', '(', 'rel', 'of', ':a', 'is', '(', 'rel', 'of', ':b', 'is', ':c', ')', ')', 'of', ':a', ')', 'of', ':b'];

    const ast = parse(tokens);

    expect(ast).toStrictEqual([{
      obj: 'app',
      rel: {
        obj: 'app',
        rel: {
          obj: 'rel',
          rel: { ':a': {
            obj: 'rel',
            rel: { ':b': ':c' },
          }},
        },
        arg: ':a',
      },
      arg: ':b',
    }]);
  });

  it('parses relation matching value', () => {
    const tokens = ['rel', 'a', 'of', 'v', 'is', 'match', 'v', 'in', ':b', 'is', ':c', ',', ':d', 'is', ':e'];

    const ast = parse(tokens);

    expect(ast).toStrictEqual([{
      obj: 'rel',
      id: 'a',
      rel: { ':b': ':c', ':d': ':e' },
    }]);
  });
});
