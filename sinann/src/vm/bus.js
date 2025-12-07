module.exports = class Bus {
  constructor() {
    this._devices = [];
  }

  registerRom(rom) {
    this._devices[0] = rom;
  }

  registerProcessor(processor) {
    this._devices[1] = processor;
  }

  registerMemory(memory) {
    this._devices[2] = memory;
  }

  register(segment, device) {
    if (segment < 0x03) {
      throw 'Reserved segment';
    }
    this._devices[segment] = device;
  }

  async read(addr) {
    const segment = (0xFF00 & addr) >> 8;
    const offset = 0x00FF & addr;

    if (!this._devices['' + segment]) {
      if (offset === 0x00) {
        return [0xff, 0xff];
      }
      throw 'Invalid segment';
    }

    return await this._devices['' + segment].read(offset);
  }

  write(addr, data) {
    const segment = (0xFF00 & addr) >> 8;
    const offset = 0x00FF & addr;
    this._devices['' + segment].write(offset, data);
  }
}
