const Movi = require('./movi');

describe('movi', () => {
  it('stores immediate data into register', async() => {
    const registers = {};
    const instruction = new Movi(registers, {});

    await instruction.exec(0x00, 0x01, 0x02);

    expect(registers[0x00]).toStrictEqual([0x01, 0x02]);
  });
});
