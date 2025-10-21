const exec = require('child_process').execSync;

describe('sabia', () => {
  it.only('exec inline code', () => {
    const code = 'T = A; T::A;';

    const output = exec(`bin/run --inline "${code}"`);

    expect(output.toString()).toStrictEqual('[app::T] A\n');
  });
});
