const Readi = require('./readi');

describe('readi', () => {
  it('reads from immediate memory address', async() => {
    const registers = {};
    const bus = {
      read: addr => {
        if (addr === 0x1234) {
          return [0x56, 0x78];
        }
      },
    };
    const instruction = new Readi(registers, bus);

    await instruction.exec(0x00, 0x12, 0x34);

    expect(registers[0x00]).toStrictEqual([0x56, 0x78]);
  });
});
