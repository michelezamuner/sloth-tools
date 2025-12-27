module.exports = class Cmp {
  constructor(registers, bus) {
    this._registers = registers;
    this._bus = bus;
  }

  async exec(op1, op2, op3) {
    const first = this._registers[op1][0] * 256 + this._registers[op1][1];
    const second = this._registers[op2][0] * 256 + this._registers[op2][1];
    if (first === second) {
      this._registers[op1] = [0x00, 0x00];
    }
    if (first < second) {
      this._registers[op1] = [0x00, 0x01];
    }
    if (first > second) {
      this._registers[op1] = [0x00, 0x02];
    }
  }
};
