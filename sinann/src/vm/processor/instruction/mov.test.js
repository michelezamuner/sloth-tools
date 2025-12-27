const Mov = require('./mov');

describe('mov', () => {
  it('stores register data into register', async() => {
    const registers = { 0x00: [0x12, 0x34], 0x01: [0x56, 0x78] };
    const instruction = new Mov(registers, {});

    await instruction.exec(0x00, 0x01, 0x00);

    expect(registers[0x00]).toStrictEqual([0x56, 0x78]);
  });
});
