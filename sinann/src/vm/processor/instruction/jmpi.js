module.exports = class Jmpi {
  constructor(registers) {
    this._registers = registers;
  }

  async exec(op1, op2, op3) {
    this._registers.ip = op1 * 256 + op2;
  }
};
