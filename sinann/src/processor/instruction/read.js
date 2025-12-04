class Read {
  constructor(processor, bus) {
    this._processor = processor;
    this._bus = bus;
  }

  exec(op) {
    const addr = op;
    const data = this._bus.read(addr);
    this._processor.accumulator = data;
  }
}

export default Read;
