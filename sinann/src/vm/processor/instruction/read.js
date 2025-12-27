module.exports = class Read {
  constructor(registers, bus) {
    this._registers = registers;
    this._bus = bus;
  }

  async exec(op1, op2, op3) {
    const reg = op1;
    const addr = this._registers[op2][0] * 256 + this._registers[op2][1];
    const data = await this._bus.read(addr);
    this._registers[reg] = data;
  }
};
