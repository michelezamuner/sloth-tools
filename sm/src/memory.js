module.exports = class Memory {
  constructor() {
    this._memory = Buffer.alloc(256);
  }

  load(data) {
    data.copy(this._memory);
  }

  read(addr, size) {
    // Deep copy read data to avoid sharing references to the Buffer
    const result = Buffer.alloc(size);
    this._memory.copy(result, 0, addr, addr + size);

    return result;
  }

  write(addr, data) {
    this._memory.set(data, addr);
  }
};
