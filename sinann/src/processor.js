class Processor {
  constructor(bus) {
    this._instructions = [];
    this._bus = bus;
    this._stop = false;
    this._ip = 0x0000;
    this.accumulator = 0;
  }

  set(instructions) {
    this._instructions = instructions;
  }

  write() {
    this._stop = true;
  }

  async run() {
    return new Promise((resolve, reject) => {
      const exec = () => {
        try {
          const opcode = this._bus.read(this._ip);
          const operand = this._bus.read(this._ip + 1);
          this._instructions['' + opcode].exec(operand);

          if (this._stop) {
            return resolve();
          }

          this._ip += 2;
          setImmediate(exec);
        } catch (e) {
          console.log(e);
          reject('Execution error');
        }
      };
      setImmediate(exec);
    });
  }
}

export default Processor;
