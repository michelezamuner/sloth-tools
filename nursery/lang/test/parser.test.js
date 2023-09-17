const parse = require('../src/parser').parse;

describe('parser', () => {
  it('parses single relation definition', () => {
    const tokens = ['rel', 'a', 'of', ':b', 'is', ':c'];

    const ast = parse(tokens);

    expect(ast).toStrictEqual({
      obj: 'rel',
      id: 'a',
      arg: ':b',
      val: ':c',
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
        arg: ':b',
        val: ':c',
      },
      {
        obj: 'app',
        rel: 'a',
        arg: ':b',
      },
    ]);
  });
});
