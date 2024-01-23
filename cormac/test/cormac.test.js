const exec = require('child_process').execSync;

describe('cormac', () => {
  it('provides returning value from function', () => {
    const code = 'fun main ret 0x12';

    try {
      exec(`bin/run --eval "${code}"`);
    } catch (e) {
      expect(e.status).toBe(0x12);
      expect(e.stdout.toString()).toBe('');
    }
    expect.hasAssertions();
  });

  it('provides increment function', () => {
    const code = 'fun main ret INCR(0x11)';

    try {
      exec(`bin/run --eval "${code}"`);
    } catch (e) {
      expect(e.status).toBe(0x12);
      expect(e.stdout.toString()).toBe('');
    }
    expect.hasAssertions();
  });

  it('provides variable declaration', () => {
    const code = 'fun main a := 0x12; ret a';

    try {
      exec(`bin/run --eval "${code}"`);
    } catch (e) {
      expect(e.status).toBe(0x12);
      expect(e.stdout.toString()).toBe('');
    }
    expect.hasAssertions();
  });

  it('provides variable assignment', () => {
    const code = 'fun main a := 0x00; a = 0x12; ret a';

    try {
      exec(`bin/run --eval "${code}"`);
    } catch (e) {
      expect(e.status).toBe(0x12);
      expect(e.stdout.toString()).toBe('');
    }
    expect.hasAssertions();
  });
});
