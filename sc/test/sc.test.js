const exec = require('child_process').execSync;
const fs = require('fs');

describe('sc', () => {
  it('compiles program', () => {
    const program = '_ : _ _ -> 0';

    fs.writeFileSync('/tmp/sc_test', program);

    exec('bin/sc /tmp/sc_test');

    const contents = fs.readFileSync('out.sbc', 'utf-8');
    fs.unlinkSync('out.sbc');
    expect(contents).toBe('exit_i 0x00');
  });
});
