const exec = require('child_process').execSync;

describe('cormac', () => {
  it('exits the process with a status code', () => {
    const code = 'exit(0x12)';

    try {
      exec(`bin/run --eval "${code}"`);
    } catch (e) {
      expect(e.status).toBe(0x12);
      expect(e.stdout.toString()).toBe('');
    }
    expect.hasAssertions();
  });
});
