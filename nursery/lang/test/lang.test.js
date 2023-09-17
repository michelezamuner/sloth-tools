const exec = require('child_process').execSync;

describe('lang', () => {
  it('evaluates code', () => {
    const val = Math.floor(Math.random() * 10);
    const code = `rel a of :b is :${val}; a of :b`;

    const output = exec(`bin/lang -e \'${code}\'`);

    expect(output.toString().trim()).toBe(`:${val}`);
  });
});
