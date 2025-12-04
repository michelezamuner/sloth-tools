class Write {
  constructor(processor, bus) {
    this._processor = processor;
    this._bus = bus;
  }

  exec(op) {
    const addr = op;
    const data = this._processor.accumulator;
    this._bus.write(addr, data);
  }
}

export default Write;
