const fs = require('fs');

module.exports = class System {
  constructor(memory) {
    this._types = [];
    this._types[0x02] = 'write';
    this._memory = memory;
  }

  call(type, registers) {
    this[`_${this._types[type]}`](registers);
  }

  _write(registers) {
    const fd = registers[0].readUInt16BE();
    const start = registers[1].readUInt16BE();
    const offset = registers[2].readUInt16BE();
    const length = registers[3].readUInt16BE();

    const result = fs.writeSync(fd, this._memory.read(start + offset, length));

    registers[0] = Buffer.from([(result & 0xff00) >>> 8, result & 0x00ff]);
  }
};
