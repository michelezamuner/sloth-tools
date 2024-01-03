const { code } = require('fedelm');
const { exec } = require('../src/executor');
const memory = require('../src/memory');

describe('executor', () => {
  it('executes exit_i', () => {
    const instruction = Buffer.from([code('exit_i'), 0x12]);

    const result = exec(instruction);

    expect(result).toStrictEqual({ exit: 0x12 });
  });

  it('executes exit', () => {
    const mem = memory.create(0xff);
    memory.set(mem, code('a'), Buffer.from([0x00, 0x12]));
    const instruction = Buffer.from([code('exit'), code('a')]);

    const result = exec(instruction, mem);

    expect(result).toStrictEqual({ exit: 0x12 });
  });

  it('executes set_i', () => {
    const mem = memory.create(0);
    const instruction = Buffer.from([code('set_i'), code('a'), 0x12, 0x34]);

    const result = exec(instruction, mem);

    expect(memory.get(mem, code('a'))).toStrictEqual(Buffer.from([0x12, 0x34]));
    expect(result).toStrictEqual({});
  });

  it('executes set', () => {
    const mem = memory.create(0);
    memory.set(mem, code('b'), Buffer.from([0x12, 0x34]));
    const instruction = Buffer.from([code('set'), code('a'), code('b')]);

    const result = exec(instruction, mem);

    expect(memory.get(mem, code('a'))).toStrictEqual(Buffer.from([0x12, 0x34]));
    expect(result).toStrictEqual({});
  });

  it('executes incr', () => {
    const mem = memory.create(0);
    memory.set(mem, code('a'), Buffer.from([0x12, 0x34]));
    const instruction = Buffer.from([code('incr'), code('a')]);

    const result = exec(instruction, mem);

    expect(memory.get(mem, code('a'))).toStrictEqual(Buffer.from([0x12, 0x35]));
    expect(result).toStrictEqual({});
  });

  it('executes push', () => {
    const mem = memory.create(0xf);
    memory.set(mem, code('a'), Buffer.from([0x12, 0x34]));
    const instruction = Buffer.from([code('push'), code('a')]);

    const result = exec(instruction, mem);

    expect(memory.pop(mem)).toStrictEqual(Buffer.from([0x12, 0x34]));
    expect(result).toStrictEqual({});
  });

  it('executes pop', () => {
    const mem = memory.create(0xf);
    memory.push(mem, Buffer.from([0x12, 0x34]));
    const instruction = Buffer.from([code('pop'), code('b')]);

    const result = exec(instruction, mem);

    expect(memory.get(mem, code('b'))).toStrictEqual(Buffer.from([0x12, 0x34]));
    expect(result).toStrictEqual({});
  });
});
