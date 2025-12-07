module.exports = class OutputLog {
  constructor(log) {
    this._log = log || console.log;
  }

  async read(addr) {
    if (addr === 0x00) {
      // Device type "output"
      return [0x00, 0x00];
    }
  }

  write(addr, data) {
    this._log(`WRITE: 0x${addr.toString(16).padStart(2, '0')}, [0x${data[0].toString(16).padStart(2, '0')}, 0x${data[1].toString(16).padStart(2, '0')}]`);
  }
}
