module.exports = class Cmpi {
  constructor(registers, bus) {
    this._registers = registers;
    this._bus = bus;
  }

  async exec(op1, op2, op3) {
    const first = this._registers[op1][0] * 256 + this._registers[op1][1];
    const second = op2 * 256 + op3;
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
