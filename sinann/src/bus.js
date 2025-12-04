class Bus {
  constructor() {
    this._devices = {};
  }

  register(segment, device) {
    this._devices[segment] = device;
  }

  read(addr) {
    const segment = (0xFF00 & addr) >> 8;
    const offset = 0x00FF & addr;
    return this._devices['' + segment].read(offset);
  }

  write(addr, data) {
    const segment = (0xFF00 & addr) >> 8;
    const offset = 0x00FF & addr;
    this._devices['' + segment].write(offset, data);
  }
}

export default Bus;
