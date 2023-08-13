const exec = require('child_process').execSync;
const fs = require('fs');

describe('sm', () => {
  it('exits with the exit status of the program', () => {
    const program = 'exit_i 0x12';
    fs.writeFileSync('/tmp/sm_test', program);

    try {
      exec('bin/sm /tmp/sm_test');
    } catch(e) {
      expect(e.status).toBe(0x12);
      expect(e.stdout.toString()).toBe('');
    }
    expect.hasAssertions();
  });
});
