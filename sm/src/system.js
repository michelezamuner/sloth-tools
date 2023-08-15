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
    registers[0] = fs.writeSync(registers[0], this._memory.read(registers[1] + registers[2], registers[3]));
  }
};
