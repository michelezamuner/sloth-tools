const Jmp = require('./jmp');

describe('jmp', () => {
  it('jumps to the given register address', async() => {
    const registers = { ip: 0x0000, 0x00: [0x12, 0x34] };
    const instruction = new Jmp(registers, {});

    await instruction.exec(0x00, 0x00, 0x00);

    expect(registers.ip).toStrictEqual(0x1234);
  });
});
