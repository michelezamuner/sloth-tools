const exec = require('child_process').execSync;

describe('sabia', () => {
  it('exec inline code', () => {
    const code = 'T = A\nT.A';

    const output = exec(`bin/run --inline "${code}"`);

    expect(output.toString()).toStrictEqual('[::_::T] A\n');
  });

  it('exec inline code with multiple lines', () => {
    const code = `
      T = A
      T.A
    `;

    const output = exec(`bin/run --inline "${code}"`);

    expect(output.toString()).toStrictEqual('[::_::T] A\n');
  });
});
