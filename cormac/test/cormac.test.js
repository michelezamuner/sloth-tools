const exec = require('child_process').execSync;

describe('cormac', () => {
  it('evaluates single value', () => {
    const code = '0x12';

    try {
      exec(`bin/run --eval "${code}"`);
    } catch (e) {
      expect(e.status).toBe(0x12);
      expect(e.stdout.toString()).toBe('');
    }
    expect.hasAssertions();
  });

  it('increments a value', () => {
    const code = '0x11++';

    try {
      exec(`bin/run --eval "${code}"`);
    } catch (e) {
      expect(e.status).toBe(0x12);
      expect(e.stdout.toString()).toBe('');
    }
    expect.hasAssertions();
  });
});
