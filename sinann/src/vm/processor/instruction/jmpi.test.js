const Jmpi = require('./jmpi');

describe('jmpi', () => {
  it('jumps to the given immediate address', async() => {
    const registers = { ip: 0x0000 };
    const instruction = new Jmpi(registers, {});

    await instruction.exec(0x00, 0x01, 0x00);

    expect(registers.ip).toStrictEqual(0x0001);
  });
});
