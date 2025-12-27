const Memory = require('./memory');

describe('memory', () => {
  it('declares device type at last address', async() => {
    const memory = new Memory();

    const type = await memory.read(0xfff);

    expect(type).toStrictEqual([0x00, 0x00]);
  });

  it('reads and writes data at given addresses', async() => {
    const memory = new Memory();

    memory.write(0x020, [0x12, 0x34]);
    const data = await memory.read(0x020);

    expect(data).toStrictEqual([0x12, 0x34]);
  });
});
