class Put {
  constructor(processor) {
    this._processor = processor;
  }

  exec(op) {
    const data = op;
    this._processor.accumulator = data;
  }
}

export default Put;
