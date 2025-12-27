module.exports = class StorageMemory {
  constructor(data) {
    this._data = data;
  }

  async read(addr) {
    if (addr === 0xfff) {
      // Device type: storage
      return [0x00, 0x04];
    }

    // Simulate storage slowness
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(this._data.slice(addr, addr + 2));
      }, 10);
    });
  }

  write(addr, data) {
    this._data.splice(addr, 2, ...data);
  }
};
