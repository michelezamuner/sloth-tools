const Linker = require('../src/linker');

describe('linker', () => {
  let linker = null;

  beforeEach(() => {
    linker = new Linker();
  });

  it('links program with a single function', () => {
    const unit = `
      ; _
      pop a
      push_i 0x00 0x00
      jmp_r a
    `.split('\n').map(l => l.trim()).join('\n').trim();

    const program = linker.parse(unit);

    expect(program).toBe(`
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

  it('links program that calls native function', () => {
    const unit = `
      ; _
      pop b
      push_i 0x00 0x01
      push_i 0x00 0x01
      nat_i #{_+14} 0x0b
      jmp_r b
      0x73 0x74 0x64 0x2e 0x69 0x6e 0x74 0x2e 0x61 0x64 0x64
    `.split('\n').map(l => l.trim()).join('\n').trim();

    const program = linker.parse(unit);

    expect(program).toBe(`
      push_i 0x00 0x06
      jmp_i 0x00 0x0a
      pop a
      exit_r a
      ; _
      pop b
      push_i 0x00 0x01
      push_i 0x00 0x01
      nat_i 0x00 0x18 0x0b
      jmp_r b
      0x73 0x74 0x64 0x2e 0x69 0x6e 0x74 0x2e 0x61 0x64 0x64
    `.split('\n').map(l => l.trim()).join('\n').trim());
  });

  it('links program that calls local function', () => {
    const unit = `
      ; _
      push_i #{_+12}
      push_i 0x00 0x01
      push_i 0x00 0x02
      jmp_i #{f}
      pop a
      pop b
      push_r a
      jmp_r b
      ; f
      pop a
      pop b
      push_r a
      push_r b
      nat_i #{f+20} 0x0b
      pop a
      pop b
      push_r a
      jmp_r b
      0x73 0x74 0x64 0x2e 0x69 0x6e 0x74 0x2e 0x61 0x64 0x64
    `.split('\n').map(l => l.trim()).join('\n').trim();

    const program = linker.parse(unit);

    expect(program).toBe(`
      push_i 0x00 0x06
      jmp_i 0x00 0x0a
      pop a
      exit_r a
      ; _
      push_i 0x00 0x16
      push_i 0x00 0x01
      push_i 0x00 0x02
      jmp_i 0x00 0x1e
      pop a
      pop b
      push_r a
      jmp_r b
      ; f
      pop a
      pop b
      push_r a
      push_r b
      nat_i 0x00 0x32 0x0b
      pop a
      pop b
      push_r a
      jmp_r b
      0x73 0x74 0x64 0x2e 0x69 0x6e 0x74 0x2e 0x61 0x64 0x64
    `.split('\n').map(l => l.trim()).join('\n').trim());
  });
});
