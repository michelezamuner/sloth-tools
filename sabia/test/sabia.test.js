const exec = require('child_process').execSync;

describe('sabia', () => {
  it('can define sum types', () => {
    const code = `
      T = A | B
      T.A
    `;

    const output = exec(`bin/run --inline "${code}"`);

    expect(output.toString()).toStrictEqual('[::_::T] A\n');
  });
});
