const Vm = require('../src/vm');

describe('vm', () => {
  let vm = null;
  const memory = {};

  beforeEach(() => {
    vm = new Vm(memory);
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
});
