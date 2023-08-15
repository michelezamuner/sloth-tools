module.exports = class Vm {
  constructor(memory, system) {
    this._opcodes = {
      0x00: [1, 'exitI'],
      0x01: [1, 'exitR'],
      0x10: [3, 'setI'],
      0x20: [2, 'jmpI'],
      0x21: [1, 'jmpR'],
      0x30: [2, 'pushI'],
      0x31: [1, 'pushR'],
      0x40: [1, 'pop'],
      0x50: [1, 'incr'],
      0xff: [1, 'sys'],
    };
    this._memory = memory;
    this._system = system;
    this._registers = [];
    this._addr = 0;
    this._opcode = null;
    this._operands = null;
    this._exitStatus = null;
    this._stackPtr = 0xf0;
  }

  run() {
    while (this._exitStatus === null) {
      this._opcode = this._memory.read(this._addr, 1).readUInt8();
      this._addr++;
      this._operands = this._memory.read(this._addr, this._opcodes[this._opcode][0]);
      this._addr = this._addr + this._opcodes[this._opcode][0];
      this[`_${this._opcodes[this._opcode][1]}`]();
    }

    return this._exitStatus;
  }

  _exitI() {
    this._exitStatus = this._operands.readUInt8();
  }

  _exitR() {
    this._exitStatus = this._registers[this._operands[0]].readUInt16BE();
  }

  _setI() {
    this._registers[this._operands[0]] = this._operands.subarray(1);
  }

  _jmpI() {
    this._addr = this._operands.readUInt16BE();
  }

  _jmpR() {
    this._addr = this._registers[this._operands[0]].readUInt16BE();
  }

  _pushI() {
    this._memory.write(this._stackPtr, this._operands);
    this._stackPtr += 2;
  }

  _pushR() {
    this._memory.write(this._stackPtr, this._registers[this._operands[0]]);
    this._stackPtr += 2;
  }

  _pop() {
    this._stackPtr -= 2;
    this._registers[this._operands[0]] = this._memory.read(this._stackPtr, 2);
  }

  _incr() {
    // @todo: handle overflows
    const value = this._registers[this._operands[0]].readUInt16BE() + 1;
    this._registers[this._operands[0]] = Buffer.from([(value & 0xff00) >>> 8, value & 0x00ff]);
  }

  _sys() {
    this._system.call(this._operands[0], this._registers);
  }
};
