const { index } = require('../src/indexer');
const Lexer = require('../src/lexer');
const Parser = require('../src/parser');

describe('indexer', () => {
  it('indexes single definition', () => {
    const code = `
      ::_
        T = A | B
    `;
    const lexemes = Lexer.parse(code);
    const ast = Parser.parse(lexemes);

    const _index = index(ast);

    expect(_index).toStrictEqual({
      '::_::T': {
        ast: {
          elem: 'def',
          var: 'enum',
          id: 'T',
          vis: 'priv',
          body: [
            { elem: 'cons', id: 'A' },
            { elem: 'cons', id: 'B' },
          ],
        }
      },
    });
  });
});
