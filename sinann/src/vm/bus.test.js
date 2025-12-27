const Bus = require('./bus');

describe('bus', () => {
  it('probes devices at first address', async() => {
    const device = {
      read: () => [0x12, 0x34],
    };
    const bus = new Bus();
    bus.register(0x4, device);

    // 0xfff address can be used to verify the existence of a device
    // 0xffff means no device is registered
    expect(await bus.read(0x3fff)).toStrictEqual([0xff, 0xff]);

    // any other address will fail if the device is not registered
    expect(async() => await bus.read(0x3001)).rejects.toMatch('No device registered at segment 0x3');

    expect(await bus.read(0x4000)).toStrictEqual([0x12, 0x34]);
  });

  it('reads from correct address of registered device', async() => {
    const device = {
      read: addr => {
        if (addr === 0x321) {
          return [0x56, 0x78];
        }
      },
    };
    const bus = new Bus();

    bus.register(0x4, device);
    const data = await bus.read(0x4321);

    expect(data).toStrictEqual([0x56, 0x78]);
  });

  it('writes to correct address of registered device', () => {
    const device = {
      write: jest.fn(),
    };
    const bus = new Bus();

    bus.register(0x4, device);
    bus.write(0x4321, [0x12, 0x34]);

    expect(device.write).toHaveBeenCalledWith(0x321, [0x12, 0x34]);
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

    expect(() => bus.register(0x0, {})).toThrow('Reserved segment');
    expect(() => bus.register(0x1, {})).toThrow('Reserved segment');
    expect(() => bus.register(0x2, {})).toThrow('Reserved segment');

    await bus.read(0x0123);
    expect(rom.read).toHaveBeenCalledWith(0x123);

    bus.write(0x1234, [0x12, 0x34]);
    expect(processor.write).toHaveBeenCalledWith(0x234, [0x12, 0x34]);

    await bus.read(0x2345);
    expect(memory.read).toHaveBeenCalledWith(0x345);

    bus.write(0x2345, [0x12, 0x34]);
    expect(memory.write).toHaveBeenCalledWith(0x345, [0x12, 0x34]);
  });
});
