import Rom from './rom';

describe('rom', () => {
  it('reads data at given address', () => {
    const rom = new Rom([
      0x1234, 0x5678,
    ]);

    expect(rom.read(0x00)).toBe(0x1234);
    expect(rom.read(0x01)).toBe(0x5678);
  });

  it('cannot write to this device', () => {
    const rom = new Rom([]);

    expect(() => rom.write(0x00, 0x0000)).toThrow('Cannot write to device');
  });
});
