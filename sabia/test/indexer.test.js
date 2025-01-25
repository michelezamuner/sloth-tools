const { index } = require('../src/indexer');
const Lexer = require('../src/lexer');
const Parser = require('../src/parser');

describe('indexer', () => {
  it('indexes sum type definition', () => {
    const code = `
      T: A | B
    `;
    const lexemes = Lexer.parse(code);
    const ast = Parser.parse(lexemes);

    const _index = index(ast);

    expect(_index).toStrictEqual({
      T: { ast: ast },
      A: { ast: { elem: 'cons', id: 'A', type: { elem: 'type', id: 'T' } } },
      B: { ast: { elem: 'cons', id: 'B', type: { elem: 'type', id: 'T' } } },
    });
  });

  it('indexes function definition', () => {
    const code = `
      f: A -> B = a -> b
    `;
    const lexemes = Lexer.parse(code);
    const ast = Parser.parse(lexemes);

    const _index = index(ast);

    expect(_index).toStrictEqual({
      f: {
        ast: ast,
        index: {
          a: { ast: { elem: 'ptn', var: 'id', id: 'a' } },
        },
      },
    });
  });

  it('indexes sequence', () => {
    const code = `
      A: B
      f: A -> B = a -> b
    `;
    const lexemes = Lexer.parse(code);
    const ast = Parser.parse(lexemes);

    const _index = index(ast);

    expect(_index).toStrictEqual({
      A: { ast: Parser.parse(Lexer.parse('A: B')) },
      B: { ast: { elem: 'cons', id: 'B', type: { elem: 'type', id: 'A' } } },
      f: {
        ast: Parser.parse(Lexer.parse('f: A -> B = a -> b')),
        index: {
          a: { ast: { elem: 'ptn', var: 'id', id: 'a' } },
        },
      },
    });
  });

  it('indexes external definition', () => {
    const code = `
      e: .f
    `;
    const lexemes = Lexer.parse(code);
    const ast = Parser.parse(lexemes);

    const _index = index(ast);

    expect(_index).toStrictEqual({
      e: { ast: ast },
    });
  });
});
