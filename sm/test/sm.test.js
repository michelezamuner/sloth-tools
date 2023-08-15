const exec = require('child_process').execSync;
const fs = require('fs');

describe('sm', () => {
  it('exits with the exit status of the program', () => {
    const program = 'exit_i 0x12';

    fs.writeFileSync('/tmp/sm_test', program);

    try {
      exec('bin/sm /tmp/sm_test');
    } catch (e) {
      expect(e.status).toBe(0x12);
      expect(e.stdout.toString()).toBe('');
    }
    expect.hasAssertions();
  });

  it('calls procedure', () => {
    const program = `
      push_i 0x00 0x09 ; return address
      push_i 0x00 0x11 ; call argument
      jmp_i 0x00 0x0d ; call procedure
      pop a ; get return value of procedure call
      exit_r a ; exit with return value

      ; procedure
      pop a ; get procedure argument
      incr a ; calculate return value
      pop b ; get return address
      push_r a ; push return value
      jmp_r b ; return
    `;

    fs.writeFileSync('/tmp/sm_test', program);

    try {
      exec('bin/sm /tmp/sm_test');
    } catch (e) {
      expect(e.status).toBe(0x12);
      expect(e.stdout.toString()).toBe('');
    }
    expect.hasAssertions();
  });

  it('prints to stdout', () => {
    const program = `
      set_i a 0x00 0x01 ; stdout
      set_i b 0x00 0x14 ; data start
      set_i c 0x00 0x00 ; read offset
      set_i d 0x00 0x0d ; data length
      sys 0x02 ; sys write
      exit_r a ; exit with number of bytes written
      0x48 0x65 0x6c 0x6c 0x6f 0x2c ; "Hello,"
      0x20 0x77 0x6f 0x72 0x6c 0x64 ; " world"
      0x21 ; "!"
    `;

    fs.writeFileSync('/tmp/sm_test', program);

    try {
      exec('bin/sm /tmp/sm_test');
    } catch (e) {
      expect(e.status).toBe(0x0d);
      expect(e.stdout.toString()).toBe('Hello, world!');
    }
    expect.hasAssertions();
  });
});
