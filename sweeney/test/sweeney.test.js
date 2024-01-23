const exec = require('child_process').execSync;

describe('sweeney', () => {
  it('provides single value as implicit main return value', () => {
    const code = '0x12';

    try {
      exec(`bin/run --eval "${code}"`);
    } catch (e) {
      expect(e.status).toBe(0x12);
      expect(e.stdout.toString()).toBe('');
    }
    expect.hasAssertions();
  });

  it('provides value increment operator', () => {
    const code = '0x11++';

    try {
      exec(`bin/run --eval "${code}"`);
    } catch (e) {
      expect(e.status).toBe(0x12);
      expect(e.stdout.toString()).toBe('');
    }
    expect.hasAssertions();
  });

  it('provides expression group', () => {
    const code = '((0x10)++)++';

    try {
      exec(`bin/run --eval "${code}"`);
    } catch (e) {
      expect(e.status).toBe(0x12);
      expect(e.stdout.toString()).toBe('');
    }
    expect.hasAssertions();
  });

  it('provides variables', () => {
    const code = 'var a 0x11; a = a++; a';

    try {
      exec(`bin/run --eval "${code}"`);
    } catch (e) {
      expect(e.status).toBe(0x12);
      expect(e.stdout.toString()).toBe('');
    }
    expect.hasAssertions();
  });

  it('automatically returns with 0 if code ends with declarations', () => {
    const code = 'var a 0x12';

    const output = exec(`bin/run --eval "${code}"`);

    expect(output.toString()).toStrictEqual('');
  });

  it('automatically returns with 0 if code ends with assignment', () => {
    const code = 'var a 0x00; a = 0x12';

    const output = exec(`bin/run --eval "${code}"`);

    expect(output.toString()).toStrictEqual('');
  });
});
