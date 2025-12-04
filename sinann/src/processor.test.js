import Processor from './processor';
import { jest } from '@jest/globals';

describe('processor', () => {
  it('executes instructions read from bus in sequence', async() => {
    const operands = [];
    const instructions = [
      {
        exec(op) {
          operands[0] = op;
        }, // 0x0000
      },
      {
        exec(op) {
          operands[1] = op;
        }, // 0x0001
      },
      {
        exec(op) {
          operands[2] = op;
        }, // 0x0002
      },
    ];
    const program = [
      0x0000, 0x0102, // inst 1
      0x0001, 0x0304, // inst 2
      0x0002, 0x0506, // inst 3
    ];
    const bus = {
      read: jest.fn(addr => program[addr]),
    };
    const processor = new Processor(bus);
    processor.set(instructions);

    await expect(processor.run()).rejects.toMatch('Execution error');
    expect(bus.read.mock.calls[0][0]).toBe(0x0000);
    expect(bus.read.mock.calls[1][0]).toBe(0x0001);
    expect(bus.read.mock.calls[2][0]).toBe(0x0002);
    expect(bus.read.mock.calls[3][0]).toBe(0x0003);
    expect(bus.read.mock.calls[4][0]).toBe(0x0004);
    expect(bus.read.mock.calls[5][0]).toBe(0x0005);
    expect(operands[0]).toStrictEqual(0x0102);
    expect(operands[1]).toStrictEqual(0x0304);
    expect(operands[2]).toStrictEqual(0x0506);
  });

  it('runs until shutdown signal is received', async() => {
    let processor;
    const instructions = [
      {
        exec() {}, // noop
      },
      {
        exec() {
          processor.write(0x00, 0x0000);
        },
      },
    ];
    const program = [
      0x0000, 0x0000, // noop
      0x0000, 0x0000, // noop
      0x0001, 0x0000, // shutdown
    ];
    const bus = {
      read: addr => program[addr],
    };
    processor = new Processor(bus);
    processor.set(instructions);

    await expect(processor.run()).resolves.not.toThrow();
  });
});
