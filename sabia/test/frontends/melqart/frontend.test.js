const Frontend = require('../../../src/frontends/melqart/frontend');

describe('melqart frontend', () => {
  // @todo replace this with a more realistic sample of code
  it('parses melqart code', () => {
    const code = `
      T.A
    `;

    const lexemes = Frontend.parse(code);

    expect(lexemes).toStrictEqual(['T.A']);
  });
});
