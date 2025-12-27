module.exports = class Write {
  constructor(registers, bus) {
    this._registers = registers;
    this._bus = bus;
  }

  async exec(op1, op2, op3) {
    const data = this._registers[op2];
    const addr = this._registers[op1][0] * 256 + this._registers[op1][1];

    this._bus.write(addr, data);
  }
};
