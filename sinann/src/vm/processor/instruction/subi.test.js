const Subi = require('./subi');

describe('subi', () => {
  it('subtracts immediate from register', async() => {
    const registers = { 0x00: [0x56, 0x78] };
    const instruction = new Subi(registers, {});

    await instruction.exec(0x00, 0x12, 0x34);

    expect(registers[0x00]).toStrictEqual([0x44, 0x44]);
  });

  it('resets upon underflow', async() => {
    const registers = { 0x00: [0x00, 0x00] };
    const instruction = new Subi(registers, {});

    await instruction.exec(0x00, 0x00, 0x01);

    expect(registers[0x00]).toStrictEqual([0xFF, 0xFF]);
  });
});
