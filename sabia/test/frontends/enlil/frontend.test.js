const Frontend = require('../../../src/frontends/enlil/frontend');

describe('enlil frontend', () => {
  // @todo replace this with a more realistic sample of code
  it('parses enlil code', () => {
    const code = `
      T.A
    `;

    const lexemes = Frontend.parse(code);

    expect(lexemes).toStrictEqual(['T.A']);
  });
});
