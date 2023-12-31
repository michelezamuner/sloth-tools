module.exports = class Add {
  constructor(memory) {
    this._memory = memory;
  }

  id() { return 0x10; }

  exec() {
    const first = this._memory.pop().readUInt16BE();
    const second = this._memory.pop().readUInt16BE();

    const result = first + second;
    this._memory.push([(result & 0xff00) >>> 8, result & 0x00ff]);
  }
};
