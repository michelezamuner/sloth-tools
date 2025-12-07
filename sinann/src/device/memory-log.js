const Memory = require('./memory');

module.exports = class MemoryLog {
  constructor(log = console.log) {
    this._memory = new Memory([]);
    this._log = log;
  }

  async read(addr) {
    return await this._memory.read(addr);
  }

  write(addr, data) {
    this._memory.write(addr, data);
    this._log(`MEM: [${this._memory._data.map(d => '0x' + d.toString(16).padStart(2, '0')).join(', ')}]`);
  }
}
