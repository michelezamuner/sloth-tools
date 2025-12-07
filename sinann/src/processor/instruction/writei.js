module.exports = class Writei {
  constructor(registers, bus) {
    this._registers = registers;
    this._bus = bus;
  }

  async exec(op1, op2, op3) {
    const reg = op1;
    const addr = op2 * 256 + op3;
    const data = this._registers[reg];
    this._bus.write(addr, data);
  }
}
