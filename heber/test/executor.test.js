const { code } = require('fedelm');

const { exec } = require('../src/executor');
const Memory = require('../src/memory');

describe('executor', () => {
  it('executes exit_i', () => {
    const instruction = Buffer.from([code('exit_i'), 0x12]);

    const result = exec(instruction);

    expect(result).toStrictEqual({ exit: 0x12 });
  });

  it('executes exit', () => {
    const memory = Memory.create(0xff);
    Memory.set(memory, code('a'), Buffer.from([0x00, 0x12]));
    const instruction = Buffer.from([code('exit'), code('a')]);

    const result = exec(instruction, memory);

    expect(result).toStrictEqual({ exit: 0x12 });
  });

  it('executes set_i', () => {
    const memory = Memory.create(0);
    const instruction = Buffer.from([code('set_i'), code('a'), 0x12, 0x34]);

    const result = exec(instruction, memory);

    expect(Memory.get(memory, code('a'))).toStrictEqual(Buffer.from([0x12, 0x34]));
    expect(result).toStrictEqual({});
  });

  it('executes set', () => {
    const memory = Memory.create(0);
    Memory.set(memory, code('b'), Buffer.from([0x12, 0x34]));
    const instruction = Buffer.from([code('set'), code('a'), code('b')]);

    const result = exec(instruction, memory);

    expect(Memory.get(memory, code('a'))).toStrictEqual(Buffer.from([0x12, 0x34]));
    expect(result).toStrictEqual({});
  });

  it('executes incr', () => {
    const memory = Memory.create(0);
    Memory.set(memory, code('a'), Buffer.from([0x12, 0x34]));
    const instruction = Buffer.from([code('incr'), code('a')]);

    const result = exec(instruction, memory);

    expect(Memory.get(memory, code('a'))).toStrictEqual(Buffer.from([0x12, 0x35]));
    expect(result).toStrictEqual({});
  });

  it('executes push', () => {
    const memory = Memory.create(0xf);
    Memory.set(memory, code('a'), Buffer.from([0x12, 0x34]));
    const instruction = Buffer.from([code('push'), code('a')]);

    const result = exec(instruction, memory);

    expect(Memory.pop(memory)).toStrictEqual(Buffer.from([0x12, 0x34]));
    expect(result).toStrictEqual({});
  });

  it('executes pop', () => {
    const memory = Memory.create(0xf);
    Memory.push(memory, Buffer.from([0x12, 0x34]));
    const instruction = Buffer.from([code('pop'), code('b')]);

    const result = exec(instruction, memory);

    expect(Memory.get(memory, code('b'))).toStrictEqual(Buffer.from([0x12, 0x34]));
    expect(result).toStrictEqual({});
  });
});
