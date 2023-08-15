describe('natives', () => {
  const memory = { write: jest.fn(), push: jest.fn() };
  const fs = {};

  it('sums integers', () => {
    let call = 0;
    memory.pop = () => {
      call++;
      if (call === 1) return Buffer.from([0x00, 0x01]);
      if (call === 2) return Buffer.from([0x00, 0x01]);
    };

    const Add = require('../src/natives/add');
    const native = new Add(memory);

    native.exec();

    expect(memory.push).toBeCalledWith([0, 2]);
  });

  it('writes to file', () => {
    memory.read = (addr, size) => {
      if (addr === 0 && size === 0x05) return Buffer.from([0x00, 0x01, 0x02, 0x03, 0x04]);
    };
    let call = 0;
    memory.pop = () => {
      call++;
      if (call === 1) return Buffer.from([0x00, 0x05]); // length
      if (call === 2) return Buffer.from([0x00, 0x00]); // offset
      if (call === 3) return Buffer.from([0x00, 0x00]); // start
      if (call === 4) return Buffer.from([0x00, 0x01]); // fd
    };
    fs.writeSync = (fd, data) => fd === 1 && JSON.stringify(data) === JSON.stringify(Buffer.from([0x00, 0x01, 0x02, 0x03, 0x04])) ? 5 : null;

    const SysWrite = require('../src/natives/sys_write');
    const native = new SysWrite(memory, fs);

    native.exec();
    expect(memory.push).toBeCalledWith([0, 5]);
  });
});
