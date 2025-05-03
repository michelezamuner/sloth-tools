const Frontend = require('../../src/frontends/enlil/frontend');
const Parser = require('../../src/compiler/parser');

describe('parser', () => {
  it('parses enum expression', () => {
    const code = `
      T.A
    `;
    const lexemes = Frontend.parse(code);

    const ast = Parser.parse(lexemes);

    expect(ast).toStrictEqual({
      elem: 'exp',
      var: 'enum',
      type: { elem: 'type', var: 'id', id: 'T' },
      body: { elem: 'cons', id: 'A' },
    });
  });
});
