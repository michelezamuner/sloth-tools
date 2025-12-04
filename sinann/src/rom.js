class Rom {
  constructor(data) {
    this._data = data;
  }

  read(addr) {
    return this._data[addr];
  }

  write() {
    throw 'Cannot write to device';
  }
}

export default Rom;
