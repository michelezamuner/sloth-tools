const { parse } = require('../../src/parser/group');
const Lexer = require('../../src/lexer');

describe('group parser', () => {
  it('parses code not in parenthesis', () => {
    const code = `
      a b c
    `;
    const lexemes = Lexer.parse(code);

    const ast = parse(lexemes);

    expect(ast).toStrictEqual({
      elem: 'exp',
      var: 'eval',
      fun: { elem: 'exp', var: 'id', id: 'a' },
      args: [
        { elem: 'exp', var: 'id', id: 'b' },
        { elem: 'exp', var: 'id', id: 'c' }
      ],
    });
  });

  it('parses code in parenthesis', () => {
    const code = `
      a (b c)
    `;
    const lexemes = Lexer.parse(code);

    const ast = parse(lexemes);

    expect(ast).toStrictEqual({
      elem: 'exp',
      var: 'eval',
      fun: { elem: 'exp', var: 'id', id: 'a' },
      args: [
        {
          elem: 'exp',
          var: 'eval',
          fun: { elem: 'exp', var: 'id', id: 'b' },
          args: [{ elem: 'exp', var: 'id', id: 'c' }],
        },
      ],
    });
  });

  it('parses code in nested parenthesis', () => {
    const code = `
      a (b (c d) (e f))
    `;
    const lexemes = Lexer.parse(code);

    const ast = parse(lexemes);

    expect(ast).toStrictEqual({
      elem: 'exp',
      var: 'eval',
      fun: { elem: 'exp', var: 'id', id: 'a' },
      args: [
        {
          elem: 'exp',
          var: 'eval',
          fun: { elem: 'exp', var: 'id', id: 'b' },
          args: [
            {
              elem: 'exp',
              var: 'eval',
              fun: { elem: 'exp', var: 'id', id: 'c' },
              args: [{ elem: 'exp', var: 'id', id: 'd' }],
            },
            {
              elem: 'exp',
              var: 'eval',
              fun: { elem: 'exp', var: 'id', id: 'e' },
              args: [{ elem: 'exp', var: 'id', id: 'f' }],
            },
          ],
        },
      ],
    });
  });
});
