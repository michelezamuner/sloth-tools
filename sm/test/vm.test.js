const Vm = require('../src/vm');

describe('vm', () => {
  let vm = null;
  const memory = { write: jest.fn() };

  beforeEach(() => {
    vm = new Vm(memory);
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

  it('reads immediate address from memory', () => {
    memory.read = (addr, size) => {
      if (addr === 0 && size === 1) return Buffer.from([0x60]); // read_i
      if (addr === 1 && size === 3) return Buffer.from([0x00, 0x00, 0x06]); // a read_address
      if (addr === 4 && size === 1) return Buffer.from([0x01]); // exit_r
      if (addr === 5 && size === 1) return Buffer.from([0x00]); // a
      if (addr === 6 && size === 2) return Buffer.from([0x00, 0x12]); // exit value
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
    };
    memory.push = jest.fn();
    let call = 0;
    memory.pop = () => {
      call++;
      if (call === 1) return Buffer.from([0x00, 0x11]);
      if (call === 2) return Buffer.from([0x00, 0x09]);
      if (call === 3) return Buffer.from([0x00, 0x12]);
    };

    const status = vm.run();

    expect(memory.push.mock.calls[0][0]).toStrictEqual(Buffer.from([0x00, 0x09]));
    expect(memory.push.mock.calls[1][0]).toStrictEqual(Buffer.from([0x00, 0x11]));
    expect(memory.push.mock.calls[2][0]).toStrictEqual(Buffer.from([0x00, 0x12]));
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

  it('calls native procedure', () => {
    memory.read = (addr, size) => {
      if (addr === 0 && size === 1) return Buffer.from([0xf0]); // nat_i
      if (addr === 1 && size === 1) return Buffer.from([0x12]);  // id of nat procedure
      if (addr === 2 && size === 1) return Buffer.from([0x40]); // pop
      if (addr === 3 && size === 1) return Buffer.from([0x00]); // a
      if (addr === 4 && size === 1) return Buffer.from([0x01]); // exit_r
      if (addr === 5 && size === 1) return Buffer.from([0x00]); // a
    };
    memory.pop = () => Buffer.from([0x00, 0x12]);
    // check must be done here because at the end of the execution
    // registers will have been changed by the next instructions
    const native = {
      id: () => 0x12,
      exec: jest.fn(),
    };

    vm.native(native);
    const status = vm.run();

    expect(native.exec).toBeCalled();
    expect(status).toBe(0x12);
  });
});
