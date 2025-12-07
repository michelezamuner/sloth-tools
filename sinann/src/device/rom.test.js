const Rom = require('./rom');

describe('rom', () => {
  it('declares device type at last address', async() => {
    const rom = new Rom([]);

    const type = await rom.read(0xff);

    expect(type).toStrictEqual([0x00, 0x02]);
  });

  it('reads data at given address', async() => {
    const rom = new Rom([
      0x12, 0x34, 0x56, 0x78,
    ]);

    let data = await rom.read(0x00);
    expect(data).toStrictEqual([0x12, 0x34]);

    data = await rom.read(0x02);
    expect(data).toStrictEqual([0x56, 0x78]);
  });

  it('cannot write to this device', () => {
    const rom = new Rom([]);

    expect(() => rom.write(0x00, [0x00, 0x00])).toThrow('Cannot write to device');
  });
});
