module.exports = class Memory {
  constructor() {
    this._data = [];
  }

  async read(addr) {
    if (addr === 0xff) {
      // Device type: memory
      return [0x00, 0x01];
    }

    // Memory is as fast as possible (no slowdown)
    return this._data.slice(addr, addr + 2);
  }

  write(addr, data) {
    this._data.splice(addr, 2, ...data);
  }
}
