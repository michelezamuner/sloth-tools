const exec = require('child_process').execSync;
const fs = require('fs');

describe('sc', () => {
  it('compiles program', () => {
    const program = '_ : _ _ -> 0';

    fs.writeFileSync('/tmp/sc_test', program);

    exec('bin/sc /tmp/sc_test');

    const contents = fs.readFileSync('out.sbc', 'utf-8');
    fs.unlinkSync('out.sbc');
    expect(contents).toBe(`
      push_i 0x00 0x06
      jmp_i 0x00 0x0a
      pop a
      exit_r a
      ; _
      pop a
      push_i 0x00 0x00
      jmp_r a
    `.split('\n').map(l => l.trim()).join('\n').trim());
  });
});
