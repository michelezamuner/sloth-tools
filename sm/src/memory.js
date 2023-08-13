module.exports = class Memory {
  constructor() {
    this._memory = Buffer.alloc(256);
  }

  load(data) {
    data.copy(this._memory);
  }

  read(addr, size) {
    return this._memory.subarray(addr, addr + size);
  }
};
