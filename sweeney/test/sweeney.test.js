const exec = require('child_process').execSync;

describe('sweeney', () => {
  it('single value is implicitly used as main return value', () => {
    const code = '0x12';

    try {
      exec(`bin/run --eval "${code}"`);
    } catch (e) {
      expect(e.status).toBe(0x12);
      expect(e.stdout.toString()).toBe('');
    }
    expect.hasAssertions();
  });
});
