const exec = require('child_process').execSync;
const fs = require('fs');

describe('sloth', () => {
  it('exits with exit status', () => {
    const program = '_ : _ _ -> 0x12';

    fs.writeFileSync('/tmp/sloth_test', program);

    try {
      exec('bin/sloth /tmp/sloth_test');
    } catch(e) {
      expect(e.status).toBe(0x12);
      expect(e.stdout.toString()).toBe('');
    }
    expect.hasAssertions();
  });
});
