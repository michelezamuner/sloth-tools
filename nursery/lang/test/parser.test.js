const parse = require('../src/parser').parse;

describe('parser', () => {
  it('parses single relation', () => {
    const tokens = ['rel', 'a', 'of', ':b', 'is', ':c'];

    const ast = parse(tokens);

    expect(ast).toStrictEqual({
      obj: 'rel',
      id: 'a',
      rel: { ':b': ':c'},
    });
  });

  it('parses anonymous relation', () => {
    const tokens = ['rel', 'of', ':b', 'is', ':c'];

    const ast = parse(tokens);

    expect(ast).toStrictEqual({
      obj: 'rel',
      id: '#rel_0',
      rel: { ':b': ':c'},
    });
  });

  it('parses application', () => {
    const tokens = ['a', 'of', ':b'];

    const ast = parse(tokens);

    expect(ast).toStrictEqual({
      obj: 'app',
      rel: 'a',
      arg: ':b',
    });
  });

  it('parses multiple expressions', () => {
    const tokens = ['rel', 'of', ':a', 'is', ':b', ';', 'rel', 'of', ':c', 'is', ':d', ';', 'a', 'of', ':b'];

    const ast = parse(tokens);

    expect(ast).toStrictEqual([
      {
        obj: 'rel',
        id: '#rel_0',
        rel: { ':a': ':b'},
      },
      {
        obj: 'rel',
        id: '#rel_1',
        rel: { ':c': ':d'},
      },
      {
        obj: 'app',
        rel: 'a',
        arg: ':b',
      },
    ]);
  });

  it('prevents from defining multiple relations with the same name', () => {
    const tokens = ['rel', 'a', 'of', ':b', 'is', ':c', ';', 'rel', 'a', 'of', ':c', 'is', ':d'];

    expect(() => parse(tokens)).toThrow('Relation `a` is defined multiple times');
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
  });

  it('parses relation matching single value', () => {
    const tokens = ['rel', 'a', 'of', 'v', 'is', 'match', 'v', 'in', ':b', 'is', ':c', ',', ':d', 'is', ':e'];

    const ast = parse(tokens);

    expect(ast).toStrictEqual({
      obj: 'rel',
      id: 'a',
      rel: { ':b': ':c', ':d': ':e' },
    });
  });
});
