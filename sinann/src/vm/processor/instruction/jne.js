module.exports = class Jl {
  constructor(registers, bus) {
    this._registers = registers;
    this._bus = bus;
  }

  async exec(op1, op2, op3) {
    const cmp = this._registers[op1];
    if (cmp[1] !== 0x00) {
      this._registers.ip = op2 * 256 + op3;
    }
  }
};
