import Bus from './bus';
import { jest } from '@jest/globals';

describe('bus', () => {
  it('reads from correct address of registered device', () => {
    const device = {
      read: addr => {
        if (addr === 0x34) {
          return 0x5678;
        }
      },
    };
    const bus = new Bus();

    bus.register(0x12, device);
    const data = bus.read(0x1234);

    expect(data).toBe(0x5678);
  });

  it('writes to correct address of registered device', () => {
    const device = {
      write: jest.fn(),
    };
    const bus = new Bus();

    bus.register(0x12, device);
    bus.write(0x1234, 0x12);

    expect(device.write).toHaveBeenCalledWith(0x34, 0x12);
  });
});
