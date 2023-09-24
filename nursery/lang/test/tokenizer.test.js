const tokenize = require('../src/tokenizer').tokenize;

describe('tokenizer', () => {
  it('parses relations definitions', () => {
    const code = 'rel a of :b is :c';

    const tokens = tokenize(code);

    expect(tokens).toStrictEqual(['rel', 'a', 'of', ':b', 'is', ':c']);
  });

  it('parses relations applications', () => {
    const code = 'a of :b';

    const tokens = tokenize(code);

    expect(tokens).toStrictEqual(['a', 'of', ':b']);
  });

  it('parses applications of anonymous relations', () => {
    const code = '(rel of :b is :c) of :b';

    const tokens = tokenize(code);

    expect(tokens).toStrictEqual(['(', 'rel', 'of', ':b', 'is', ':c', ')', 'of', ':b']);
  });

  it('parses multiple expressions inline', () => {
    const code = 'a of :b; c of :d';

    const tokens = tokenize(code);

    expect(tokens).toStrictEqual(['a', 'of', ':b', ';', 'c', 'of', ':d']);
  });

  it('parses multiple expressions on multiple lines', () => {
    const code = 'a of :b\nc of :d';

    const tokens = tokenize(code);

    expect(tokens).toStrictEqual(['a', 'of', ':b', ';', 'c', 'of', ':d']);
  });

  it('parses multiline expressions', () => {
    const code = 'a of\n  :b';

    const tokens = tokenize(code);

    expect(tokens).toStrictEqual(['a', 'of', ':b']);
  });

  it('ignores comments', () => {
    const code = 'a of :b #comment; c of :d #another comment';

    const tokens = tokenize(code);

    expect(tokens).toStrictEqual(['a', 'of', ':b', ';', 'c', 'of', ':d']);
  });

  it('ignores empty lines and comment lines', () => {
    const code = `

# some comment
# on multiple lines

rel a of :b is :c

# other comment

a of :b
    `;

    const tokens = tokenize(code);

    expect(tokens).toStrictEqual(['rel', 'a', 'of', ':b', 'is', ':c', ';', 'a', 'of', ':b']);
  });

  it('parses matches', () => {
    const code = 'rel a of v is match v in :b is :c, :d is :e';

    const tokens = tokenize(code);

    expect(tokens).toStrictEqual(['rel', 'a', 'of', 'v', 'is', 'match', 'v', 'in', ':b', 'is', ':c', ',', ':d', 'is', ':e']);
  });

  it('parses exclusive matches', () => {
    const code = 'rel f of :u|:v is :b';

    const tokens = tokenize(code);

    expect(tokens).toStrictEqual(['rel', 'f', 'of', ':u', '|', ':v', 'is', ':b']);
  });
});
