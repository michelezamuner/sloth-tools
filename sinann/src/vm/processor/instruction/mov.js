module.exports = class Mov {
  constructor(registers, bus) {
    this._registers = registers;
    this._bus = bus;
  }

  async exec(op1, op2, op3) {
    const data = this._registers[op2];

    this._registers[op1] = data;
  }
};
