const parse = require('../src/parser').parse;

describe('parser', () => {
  it('parses single relation definition', () => {
    const tokens = ['rel', 'a', 'of', ':b', 'is', ':c'];

    const ast = parse(tokens);

    expect(ast).toStrictEqual({
      obj: 'rel',
      id: 'a',
      rel: { ':b': ':c'},
    });
  });

  it('parses single application', () => {
    const tokens = ['a', 'of', ':b'];

    const ast = parse(tokens);

    expect(ast).toStrictEqual({
      obj: 'app',
      rel: 'a',
      arg: ':b',
    });
  });

  it('parses mix of expressions', () => {
    const tokens = ['rel', 'a', 'of', ':b', 'is', ':c', ';', 'a', 'of', ':b'];

    const ast = parse(tokens);

    expect(ast).toStrictEqual([
      {
        obj: 'rel',
        id: 'a',
        rel: { ':b': ':c' },
      },
      {
        obj: 'app',
        rel: 'a',
        arg: ':b',
      },
    ]);
  });

  it('parses nested application', () => {
    const tokens = ['(', 'rel', 'of', ':b', 'is', ':c', ')', 'of', ':b'];

    const ast = parse(tokens);

    expect(ast).toStrictEqual([
      {
        obj: 'rel',
        id: '#rel_0',
        rel: { ':b': ':c' },
      },
      {
        obj: 'app',
        rel: '#rel_0',
        arg: ':b',
      },
    ]);
  })

  it('parses relation with match of single value', () => {
    const tokens = ['rel', 'a', 'of', 'v', 'is', 'match', 'v', 'in', ':b', 'is', ':c', ',', ':d', 'is', ':e'];

    const ast = parse(tokens);

    expect(ast).toStrictEqual({
      obj: 'rel',
      id: 'a',
      rel: { ':b': ':c', ':d': ':e' },
    });
  });
});
