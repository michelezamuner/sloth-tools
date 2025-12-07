module.exports = class Movi {
  constructor(registers) {
    this._registers = registers;
  }

  async exec(op1, op2, op3) {
    this._registers[op1] = [op2, op3];
  }
}
