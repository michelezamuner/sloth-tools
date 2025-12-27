const Addi = require('./addi');

describe('addi', () => {
  it('adds immediate to register', async() => {
    const registers = { 0x00: [0x12, 0x34] };
    const instruction = new Addi(registers, {});

    await instruction.exec(0x00, 0x56, 0x78);

    expect(registers[0x00]).toStrictEqual([0x68, 0xAC]);
  });

  it('resets upon overflow', async() => {
    const registers = { 0x00: [0xFF, 0xFF] };
    const instruction = new Addi(registers, {});

    await instruction.exec(0x00, 0x00, 0x01);

    expect(registers[0x00]).toStrictEqual([0x00, 0x00]);
  });
});
