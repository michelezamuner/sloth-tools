const Read = require('./read');

describe('read', () => {
  it('reads from bus address into register', async() => {
    const registers = [];
    const bus = {
      read: async a => {
        if (a === 0x1234) {
          return [0x56, 0x78];
        }
      },
    };
    const instruction = new Read(registers, bus);

    await instruction.exec(0x00, 0x12, 0x34);

    expect(registers[0x00]).toStrictEqual([0x56, 0x78]);
  });
});
