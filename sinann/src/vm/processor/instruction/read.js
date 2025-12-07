module.exports = class Read {
  constructor(registers, bus) {
    this._registers = registers;
    this._bus = bus;
  }

  async exec(op1, op2, op3) {
    const reg = op1;
    const addr = op2 * 256 + op3;
    const data = await this._bus.read(addr);
    this._registers[reg] = data;
  }
}
