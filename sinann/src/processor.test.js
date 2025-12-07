const Processor = require('./processor');

describe('processor', () => {
  it('executes instructions read from bus in sequence', async() => {
    const registers = [];
    const program = [
      0x00, 0x01, 0x02, 0x03,
      0x01, 0x11, 0x12, 0x13,
      0x02, 0x21, 0x22, 0x23,
    ];
    const bus = {
      read: jest.fn(addr => program.slice(addr, addr + 2)),
    };
    const instructions = [
      // 0x00
      (_reg, _bus) => {
        if (_reg === registers && _bus === bus) {
          return {
            exec(op1, op2, op3) {
              expect(op1).toBe(0x01);
              expect(op2).toBe(0x02);
              expect(op3).toBe(0x03);
            },
          };
        }
      },
      // 0x01
      (_reg, _bus) => {
        if (_reg === registers && _bus === bus) {
          return {
            exec(op1, op2, op3) {
              expect(op1).toBe(0x11);
              expect(op2).toBe(0x12);
              expect(op3).toBe(0x13);
            },
          };
        }
      },
      // 0x02
      (_reg, _bus) => {
        if (_reg === registers && _bus === bus) {
          return {
            exec(op1, op2, op3) {
              expect(op1).toBe(0x21);
              expect(op2).toBe(0x22);
              expect(op3).toBe(0x23);
              throw 'Last instruction';
            },
          };
        }
      },
    ];
    const processor = new Processor(registers, instructions, bus);

    await expect(processor.run()).rejects.toMatch('Last instruction');
    expect(bus.read.mock.calls[0][0]).toBe(0x0000);
    expect(bus.read.mock.calls[1][0]).toBe(0x0002);
    expect(bus.read.mock.calls[2][0]).toBe(0x0004);
    expect(bus.read.mock.calls[3][0]).toBe(0x0006);
    expect(bus.read.mock.calls[4][0]).toBe(0x0008);
    expect(bus.read.mock.calls[5][0]).toBe(0x000A);
  });

  it('runs until shutdown signal is received', async() => {
    let processor;
    const program = [
      0x00, 0x00, 0x00, 0x00,
      0x01, 0x00, 0x00, 0x00,
    ];
    const bus = {
      read: jest.fn(addr => program.slice(addr, addr + 2)),
    };
    const instructions = [
      // 0x00
      () => ({
        exec() {},
      }),
      // 0x01
      () => ({
        exec() {
          processor.write(0x00, [0x12, 0x34]);
        },
      }),
    ];
    processor = new Processor([], instructions, bus);

    const output = await processor.run();

    expect(output).toBe(0x1234);
  });
});
