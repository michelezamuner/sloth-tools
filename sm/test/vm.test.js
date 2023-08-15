const Vm = require('../src/vm');

describe('vm', () => {
  let vm = null;
  const memory = {};
  const system = {};

  beforeEach(() => {
    vm = new Vm(memory, system);
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
      if (type !== 0x34 && registers[0] !== 0x12) return null;
      registers[0] = 0x56;
    };

    const status = vm.run();

    expect(status).toBe(0x56);
  });
});
