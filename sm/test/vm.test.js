const Vm = require('../src/vm');

describe('vm', () => {
  let vm = null;
  const memory = { write: jest.fn() };
  const system = {};

  beforeEach(() => {
    vm = new Vm(memory, system);
  });

  it('increments value', () => {
    memory.read = (addr, size) => {
      if (addr === 0 && size === 1) return Buffer.from([0x10]); // set_i
      if (addr === 1 && size === 3) return Buffer.from([0x00, 0x00, 0x11]); // a 0x0011
      if (addr === 4 && size === 1) return Buffer.from([0x50]); // incr
      if (addr === 5 && size === 1) return Buffer.from([0x00]); // a
      if (addr === 6 && size === 1) return Buffer.from([0x01]); // exit_r
      if (addr === 7 && size === 1) return Buffer.from([0x00]); // a
    };

    const status = vm.run();

    expect(status).toBe(0x12);
  });

  it('jumps to different line', () => {
    memory.read = (addr, size) => {
      if (addr === 0 && size === 1) return Buffer.from([0x20]); // jmp_i
      if (addr === 1 && size === 2) return Buffer.from([0x00, 0x05]); // jump address
      if (addr === 3 && size === 1) return Buffer.from([0x00]); // exit_i
      if (addr === 4 && size === 1) return Buffer.from([0x11]);
      if (addr === 5 && size === 1) return Buffer.from([0x00]); // exit_i
      if (addr === 6 && size === 1) return Buffer.from([0x12]);
    };

    const status = vm.run();

    expect(status).toBe(0x12);
  });

  it('calls procedure', () => {
    let call = 0;
    memory.read = (addr, size) => {
      if (addr === 0 && size === 1) return Buffer.from([0x30]); // push_i
      if (addr === 1 && size === 2) return Buffer.from([0x00, 0x09]); // return address
      if (addr === 3 && size === 1) return Buffer.from([0x30]); // push_i
      if (addr === 4 && size === 2) return Buffer.from([0x00, 0x11]); // call argument
      if (addr === 6 && size === 1) return Buffer.from([0x20]); // jmp_i
      if (addr === 7 && size === 2) return Buffer.from([0x00, 0x0d]); // procedure address
      if (addr === 9 && size === 1) return Buffer.from([0x40]); // pop
      if (addr === 10 && size === 1) return Buffer.from([0x00]); // a
      if (addr === 11 && size === 1) return Buffer.from([0x01]); // exit_r
      if (addr === 12 && size === 1) return Buffer.from([0x00]); // a
      if (addr === 13 && size === 1) return Buffer.from([0x40]); // pop
      if (addr === 14 && size === 1) return Buffer.from([0x00]); // a
      if (addr === 15 && size === 1) return Buffer.from([0x50]); // incr
      if (addr === 16 && size === 1) return Buffer.from([0x00]); // a
      if (addr === 17 && size === 1) return Buffer.from([0x40]); // pop
      if (addr === 18 && size === 1) return Buffer.from([0x01]); // b
      if (addr === 19 && size === 1) return Buffer.from([0x31]); // push_r
      if (addr === 20 && size === 1) return Buffer.from([0x00]); // a
      if (addr === 21 && size === 1) return Buffer.from([0x21]); // jmp_r
      if (addr === 22 && size === 1) return Buffer.from([0x01]); // b
      if (addr === 0xf2 && size === 2 && call === 0) { call++; return Buffer.from([0x00, 0x09]); }
      if (addr === 0xf2 && size === 2 && call === 1) return Buffer.from([0x00, 0x12]);
      if (addr === 0xf4 && size === 2) return Buffer.from([0x00, 0x11]);
    };

    const status = vm.run();

    expect(memory.write.mock.calls[0][0]).toBe(0xf0);
    expect(memory.write.mock.calls[0][1]).toBe(2);
    expect(memory.write.mock.calls[0][2]).toStrictEqual(Buffer.from([0x00, 0x09]));
    expect(memory.write.mock.calls[1][0]).toBe(0xf2);
    expect(memory.write.mock.calls[1][1]).toBe(2);
    expect(memory.write.mock.calls[1][2]).toStrictEqual(Buffer.from([0x00, 0x11]));
    expect(memory.write.mock.calls[2][0]).toBe(0xf0);
    expect(memory.write.mock.calls[2][1]).toBe(2);
    expect(memory.write.mock.calls[2][2]).toStrictEqual(Buffer.from([0x00, 0x12]));
    expect(status).toBe(0x12);
  });

  it('returns the exit status of the program', () => {
    memory.read = (addr, size) => {
      if (addr === 0 && size === 1) return Buffer.from([0x00]); // exit_i
      if (addr === 1 && size === 1) return Buffer.from([0x12]); // exit status
    };

    const status = vm.run();

    expect(status).toBe(0x12);
  });

  it('exits with a register value', () => {
    memory.read = (addr, size) => {
      if (addr === 0 && size === 1) return Buffer.from([0x10]); // set_i
      if (addr === 1 && size === 3) return Buffer.from([0x00, 0x00, 0x12]); // a 0x0012
      if (addr === 4 && size === 1) return Buffer.from([0x01]); // exit_r
      if (addr === 5 && size === 1) return Buffer.from([0x00]); // a
    };

    const status = vm.run();

    expect(status).toBe(0x12);
  });

  it('calls system', () => {
    memory.read = (addr, size) => {
      if (addr === 0 && size === 1) return Buffer.from([0x10]); // set_i
      if (addr === 1 && size === 3) return Buffer.from([0x00, 0x00, 0x12]);  // a 0x0012
      if (addr === 4 && size === 1) return Buffer.from([0xff]); // sys
      if (addr === 5 && size === 1) return Buffer.from([0x34]); // type of syscall
      if (addr === 6 && size === 1) return Buffer.from([0x01]); // exit_r
      if (addr === 7 && size === 1) return Buffer.from([0x00]); // a
    };
    system.call = (type, registers) => {
      if (type !== 0x34 && registers[0][1] !== 0x12) return null;
      registers[0] = Buffer.from([0x00, 0x56]);
    };

    const status = vm.run();

    expect(status).toBe(0x56);
  });
});
