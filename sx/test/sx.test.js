const exec = require('child_process').execSync;
const fs = require('fs');

describe('sx', () => {
  afterAll(() => {
    fs.unlinkSync('out.sbc');
  })

  it('exits with exit status', () => {
    const program = '_ := _ _ -> 0x12';

    fs.writeFileSync('/tmp/sx_test', program);

    try {
      exec('bin/sx /tmp/sx_test');
    } catch(e) {
      expect(e.status).toBe(0x12);
      expect(e.stdout.toString()).toBe('');
    }
    expect.hasAssertions();
  });

  it('references local value', () => {
    const program = `
      _ := _ _ -> v
      v := 2
    `;

    fs.writeFileSync('/tmp/sx_test', program);

    try {
      exec('bin/sx /tmp/sx_test');
    } catch(e) {
      expect(e.status).toBe(2);
      expect(e.stdout.toString()).toBe('');
    }
    expect.hasAssertions();
  });

  it('calls native function', () => {
    const program = '_ := _ _ -> std.uint8.add 1 2';

    fs.writeFileSync('/tmp/sx_test', program);

    try {
      exec('bin/sx /tmp/sx_test');
    } catch(e) {
      expect(e.status).toBe(3);
      expect(e.stdout.toString()).toBe('');
    }
    expect.hasAssertions();
  });

  it('calls local function', () => {
    const program = `
      _ := _ _ -> f 1 3
      f := a b -> std.uint8.add a b
    `;

    fs.writeFileSync('/tmp/sx_test', program);

    try {
      exec('bin/sx /tmp/sx_test');
    } catch (e) {
      expect(e.status).toBe(4);
      expect(e.stdout.toString()).toBe('');
    }
    expect.hasAssertions();
  });

  it('uses aliases', () => {
    const program = `
      add :: std.uint8.add
      _ := _ _ -> add 1 3
    `;

    fs.writeFileSync('/tmp/sx_test', program);

    try {
      exec('bin/sx /tmp/sx_test');
    } catch (e) {
      expect(e.status).toBe(4);
      expect(e.stdout.toString()).toBe('');
    }
    expect.hasAssertions();
  });
});
