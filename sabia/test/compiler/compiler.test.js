const Frontend = require('../../src/frontends/enlil/frontend');
const Compiler = require('../../src/compiler/compiler');

describe('compiler', () => {
  // @todo replace this with a more realistic sample of code
  it.skip('compiles code into ast', () => {
    const code = `
      T.A
    `;
    const lexemes = Frontend.parse(code);

    const ast = Compiler.compile(lexemes);

    expect(ast).toStrictEqual({
      elem: 'exp',
      var: 'enum',
      type: { elem: 'type', var: 'id', id: 'T' },
      body: { elem: 'cons', id: 'A' },
    });
  });
});
