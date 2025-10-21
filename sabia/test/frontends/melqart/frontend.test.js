const Frontend = require('../../../src/frontends/melqart/frontend');

describe('melqart frontend', () => {
  // @todo replace this with a more realistic sample of code
  it('parses melqart code', () => {
    const code = `
      [T] A
    `;

    const ast = Frontend.parse(code);

    expect(ast).toStrictEqual({
      elem: 'exp',
      var: 'enum',
      type: { elem: 'type', var: 'id', id: 'T' },
      body: { elem: 'cons', id: 'A' },
    });
  });
});
