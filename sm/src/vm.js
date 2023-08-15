module.exports = class Vm {
  constructor(memory, system) {
    this._opcodes = {
      0x00: [1, 'exitI'],
      0x01: [1, 'exitR'],
      0x10: [3, 'setI'],
      0xff: [1, 'sys'],
    };
    this._memory = memory;
    this._system = system;
    this._registers = [];
    this._addr = 0;
    this._opcode = null;
    this._operands = null;
    this._exitStatus = null;
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
    this._exitStatus = this._registers[this._operands.readUInt8()];
  }

  _setI() {
    this._registers[this._operands[0]] = this._operands.subarray(1).readUInt16BE();
  }

  _sys() {
    this._system.call(this._operands[0], this._registers);
  }
};
