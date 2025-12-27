module.exports = class Jmp {
  constructor(registers) {
    this._registers = registers;
  }

  async exec(op1, op2, op3) {
    this._registers.ip = this._registers[op1][0] * 256 + this._registers[op1][1];
  }
};
