const exec = require('child_process').execSync;

describe('sabia', () => {
  it('can define sum types', () => {
    const code = `
      T: A | B
      A
    `;

    const output = exec(`bin/run --inline "${code}"`);

    expect(output.toString()).toStrictEqual('[T] A\n');
  });
});
