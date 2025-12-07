module.exports = class Rom {
  constructor(data) {
    this._data = data;
  }

  async read(addr) {
    if (addr === 0xff) {
      // Device type: ROM
      return [0x00, 0x02];
    }

    // Simulate ROM slowness
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(this._data.slice(addr, addr + 2));
      }, 100);
    });
  }

  write() {
    throw 'Cannot write to device';
  }
}
