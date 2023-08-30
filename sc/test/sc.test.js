const exec = require('child_process').execSync;
const fs = require('fs');

describe('sc', () => {
  it('compiles program', () => {
    const program = '_ := _ _ -> 0';

    fs.writeFileSync('/tmp/sc_test', program);

    exec('bin/sc /tmp/sc_test');

    const contents = fs.readFileSync('out.sbc', 'utf-8');
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

  it('throws compilation error if type check fails', () => {
    const program = '_ := _ _ -> std.uint8.add 0 256';

    fs.writeFileSync('/tmp/sc_test', program);

    try {
      exec(`bin/sc /tmp/sc_test --lib=${__dirname}/res`);
    } catch (e) {
      expect(e.stderr.toString()).toContain('Argument 1 of function std.uint8.add has type std.uint16.UInt16 instead of std.uint8.UInt8');
    }

    expect.hasAssertions();
  });
});
