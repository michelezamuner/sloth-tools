const Bus = require('./bus');

describe('bus', () => {
  it('probes devices at first address', async() => {
    const device = {
      read: () => [0x12, 0x34],
    };
    const bus = new Bus();
    bus.register(0x12, device);

    // 0x00 address can be used to verify the existence of a device
    expect(await bus.read(0x0300)).toStrictEqual([0xff, 0xff]);

    // any other address will fail if the device is not registered
    expect(async() => await bus.read(0x0301)).rejects.toMatch('Invalid segment');

    expect(await bus.read(0x1200)).toStrictEqual([0x12, 0x34]);
  });

  it('reads from correct address of registered device', async() => {
    const device = {
      read: addr => {
        if (addr === 0x34) {
          return [0x56, 0x78];
        }
      },
    };
    const bus = new Bus();

    bus.register(0x12, device);
    const data = await bus.read(0x1234);

    expect(data).toStrictEqual([0x56, 0x78]);
  });

  it('writes to correct address of registered device', () => {
    const device = {
      write: jest.fn(),
    };
    const bus = new Bus();

    bus.register(0x12, device);
    bus.write(0x1234, [0x12, 0x34]);

    expect(device.write).toHaveBeenCalledWith(0x34, [0x12, 0x34]);
  });

  it('reserves first segments', async() => {
    const rom = {
      read: jest.fn(),
    };
    const processor = {
      write: jest.fn(),
    };
    const memory = {
      read: jest.fn(),
      write: jest.fn(),
    };
    const bus = new Bus();
    bus.registerRom(rom);
    bus.registerProcessor(processor);
    bus.registerMemory(memory);

    expect(() => bus.register(0x00, {})).toThrow('Reserved segment');
    expect(() => bus.register(0x01, {})).toThrow('Reserved segment');
    expect(() => bus.register(0x02, {})).toThrow('Reserved segment');

    await bus.read(0x0023);
    expect(rom.read(0x23));

    bus.write(0x0112, [0x12, 0x34]);
    expect(processor.write).toHaveBeenCalledWith(0x12, [0x12, 0x34]);

    await bus.read(0x0212);
    expect(memory.read).toHaveBeenCalledWith(0x12);

    bus.write(0x0212, [0x12, 0x34]);
    expect(memory.write).toHaveBeenCalledWith(0x12, [0x12, 0x34]);
  });
});
