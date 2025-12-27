module.exports = class MockDevice {
  constructor(data) {
    this._data = data;
  }

  async read(addr) {
    if (addr === 0xfff) {
      return [0x00, 0x04];
    }

    const data = this._data.slice(addr, addr + 4);
    if (!data.length) {
      return [0x00, 0x00];
    }

    return data;
  }

  write(addr, data) {
    process.stdout.write(`${data.map(d => '0x' + d.toString(16).padStart(2, '0')).join(',')},`);
  }
};
