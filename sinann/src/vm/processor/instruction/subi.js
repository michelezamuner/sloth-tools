module.exports = class Subi {
  constructor(registers, bus) {
    this._registers = registers;
    this._bus = bus;
  }

  async exec(op1, op2, op3) {
    const first = this._registers[op1][0] * 256 + this._registers[op1][1];
    const second = op2 * 256 + op3;
    const result = first - second;

    this._registers[op1] = [(result & 0xff00) >>> 8, result & 0x00ff];
  }
};
