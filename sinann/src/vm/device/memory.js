module.exports = class Memory {
  constructor() {
    this._data = new Array(0x1000).fill(0);
  }

  async read(addr) {
    if (addr === 0xfff) {
      // Device type: memory
      return [0x00, 0x00];
    }

    // Memory is as fast as possible (no slowdown)
    return this._data.slice(addr, addr + 2);
  }

  write(addr, data) {
    this._data.splice(addr, 2, ...data);
  }
};
