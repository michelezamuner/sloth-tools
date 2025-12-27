const Jne = require('./jne');

describe('jl', () => {
  it('jumps to given memory location if comparison is "less than"', async() => {
    const registers = { ip: 0x1234, 0x00: [0x00, 0x01] };
    const instruction = new Jne(registers, {});

    await instruction.exec(0x00, 0x56, 0x78);

    expect(registers.ip).toBe(0x5678);
  });

  it('jumps to given memory location if comparison is "greater than"', async() => {
    const registers = { ip: 0x1234, 0x00: [0x00, 0x02] };
    const instruction = new Jne(registers, {});

    await instruction.exec(0x00, 0x56, 0x78);

    expect(registers.ip).toBe(0x5678);
  });

  it('does not jump if comparison is "equals"', async() => {
    const registers = { ip: 0x1234, 0x00: [0x00, 0x00] };
    const instruction = new Jne(registers, {});

    await instruction.exec(0x00, 0x56, 0x78);

    expect(registers.ip).toBe(0x1234);
  });
});
