module.exports = class Memory {
  constructor() {
    this._memory = Buffer.alloc(256);
    this._stackPtr = 0xf0;
  }

  load(data) {
    data.copy(this._memory);
  }

  read(addr, size) {
    return this._read(addr, size);
  }

  write(addr, data) {
    this._memory.set(data, addr);
  }

  pop() {
    this._stackPtr -= 2;

    return this._read(this._stackPtr, 2);
  }

  push(data) {
    this._memory.set(data, this._stackPtr);
    this._stackPtr += 2;
  }

  /**
   * @method
   *
   * Get a deep copy of data to be read, in order to
   * avoid sharing references to the underlying Buffer
   *
   * @arg {int} addr Memory address to copy from
   * @arg {int} size Size of data to copy
   * @return {Buffer}
   */
  _read(addr, size) {
    const result = Buffer.alloc(size);
    this._memory.copy(result, 0, addr, addr + size);

    return result;
  }
};
