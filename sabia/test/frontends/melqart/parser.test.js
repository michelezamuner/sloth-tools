const Lexer = require('../../../src/frontends/melqart/lexer');
const Resolver = require('../../../src/frontends/melqart/resolver');
const Parser = require('../../../src/frontends/melqart/parser');

describe('melqart parser', () => {
  it('parses enum expression', () => {
    const code = `
      [T] A
    `;
    const lexemes = Resolver.parse(Lexer.parse(code));

    const ast = Parser.parse(lexemes);

    expect(ast).toStrictEqual({
      elem: 'exp',
      var: 'enum',
      type: { elem: 'type', var: 'id', id: 'T' },
      body: { elem: 'cons', id: 'A' },
    });
  });
});
