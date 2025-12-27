module.exports = class Bus {
  constructor() {
    this._devices = [];
  }

  registerRom(rom) {
    this._devices[0x0] = rom;
  }

  registerProcessor(processor) {
    this._devices[0x1] = processor;
  }

  registerMemory(memory) {
    this._devices[0x2] = memory;
  }

  register(segment, device) {
    if (segment < 0x3) {
      throw 'Reserved segment';
    }
    this._devices[segment] = device;
  }

  async read(addr) {
    const segment = (0xF000 & addr) >> 12;
    const offset = 0x0FFF & addr;

    if (!this._devices['' + segment]) {
      if (offset === 0xfff) {
        return [0xff, 0xff];
      }
      throw `No device registered at segment 0x${segment.toString(16)}`;
    }

    return await this._devices['' + segment].read(offset);
  }

  write(addr, data) {
    const segment = (0xF000 & addr) >> 12;
    const offset = 0x0FFF & addr;
    this._devices['' + segment].write(offset, data);
  }
};
