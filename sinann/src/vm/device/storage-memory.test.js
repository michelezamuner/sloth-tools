const StorageMemory = require('./storage-memory');

describe('storage memory', () => {
  it('declares device type at last address', async() => {
    const device = new StorageMemory();

    const type = await device.read(0xfff);

    expect(type).toStrictEqual([0x00, 0x04]);
  });

  it('reads and writes data at given addresses', async() => {
    const data = new Array(0x1000).fill(0);
    data[0] = 0x12;
    data[1] = 0x34;
    const device = new StorageMemory(data);

    let result = await device.read(0x00);

    expect(result).toStrictEqual([0x12, 0x34]);

    device.write(0x020, [0x12, 0x34]);
    result = await device.read(0x020);

    expect(result).toStrictEqual([0x12, 0x34]);
  });
});
