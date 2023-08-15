const fs = require('fs');

module.exports = class SysWrite {
  constructor(memory) {
    this._memory = memory;
  }

  addr() { return 0x02; }

  exec() {
    const length = this._memory.pop().readUInt16BE();
    const offset = this._memory.pop().readUInt16BE();
    const start = this._memory.pop().readUInt16BE();
    const fd = this._memory.pop().readUInt16BE();

    const result = fs.writeSync(fd, this._memory.read(start + offset, length));
    this._memory.push([(result & 0xff00) >>> 8, result & 0x00ff]);
  }
};
