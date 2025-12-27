module.exports = class Processor {
  constructor(registers, instructions, bus) {
    this._registers = registers;
    this._instructions = instructions.map(build => build(registers, bus));
    this._bus = bus;
    // always starts from default ROM location
    this._registers.ip = 0x0000;
    this._stop = false;
    this._output = undefined;
  }

  write(addr, data) {
    if (addr !== 0x00) {
      return;
    }
    this._stop = true;
    this._output = data[0] * 256 + data[1];
  }

  async run() {
    return new Promise((resolve, reject) => {
      const exec = async() => {
        try {
          const [opcode, op1] = await this._bus.read(this._registers.ip);
          const [op2, op3] = await this._bus.read(this._registers.ip + 2);
          this._registers.ip += 4;

          await this._instructions['' + opcode].exec(op1, op2, op3);

          if (this._stop) {
            return resolve(this._output);
          }

          setImmediate(exec);
        } catch (e) {
          reject(e.toString());
        }
      };
      setImmediate(exec);
    });
  }
};
