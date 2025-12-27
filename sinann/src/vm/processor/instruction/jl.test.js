const Jl = require('./jl');

describe('jl', () => {
  it('jumps to given memory location if comparison is "less than"', async() => {
    const registers = { ip: 0x1234, 0x00: [0x00, 0x01] };
    const instruction = new Jl(registers, {});

    await instruction.exec(0x00, 0x56, 0x78);

    expect(registers.ip).toBe(0x5678);
  });

  it('does not jump if comparison is not "less than"', async() => {
    const registers = { ip: 0x1234, 0x00: [0x00, 0x00] };
    const instruction = new Jl(registers, {});

    await instruction.exec(0x00, 0x56, 0x78);

    expect(registers.ip).toBe(0x1234);
  });
});
