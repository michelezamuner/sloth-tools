const { code } = require('fedelm');

const { create, get, load, pop, push, read, set } = require('../src/memory');

describe('memory', () => {
  it('loads and reads bytes', () => {
    const memory = create(0x4);
    load(memory, Buffer.from([0x00, 0x12, 0x23, 0x34]));

    expect(read(memory, Buffer.from([0x00, 0x00]))).toStrictEqual(Buffer.from([0x00]));
    expect(read(memory, Buffer.from([0x00, 0x01]))).toStrictEqual(Buffer.from([0x12]));
    expect(read(memory, Buffer.from([0x00, 0x02]))).toStrictEqual(Buffer.from([0x23]));
    expect(read(memory, Buffer.from([0x00, 0x03]))).toStrictEqual(Buffer.from([0x34]));
    expect(read(memory, Buffer.from([0x00, 0x00]), 1)).toStrictEqual(Buffer.from([0x00]));
    expect(read(memory, Buffer.from([0x00, 0x00]), 2)).toStrictEqual(Buffer.from([0x00, 0x12]));
    expect(read(memory, Buffer.from([0x00, 0x00]), 3)).toStrictEqual(Buffer.from([0x00, 0x12, 0x23]));
    expect(read(memory, Buffer.from([0x00, 0x00]), 4)).toStrictEqual(Buffer.from([0x00, 0x12, 0x23, 0x34]));
  });

  it('handles registers', () => {
    const memory = create(0);

    set(memory, code('a'), Buffer.from([0x12, 0x34]));
    expect(get(memory, code('a'))).toStrictEqual(Buffer.from([0x12, 0x34]));

    set(memory, code('b'), Buffer.from([0x56, 0x78]));
    expect(get(memory, code('b'))).toStrictEqual(Buffer.from([0x56, 0x78]));

    set(memory, code('c'), Buffer.from([0x9a, 0xbc]));
    expect(get(memory, code('c'))).toStrictEqual(Buffer.from([0x9a, 0xbc]));

    set(memory, code('d'), Buffer.from([0xde, 0xf0]));
    expect(get(memory, code('d'))).toStrictEqual(Buffer.from([0xde, 0xf0]));
  });

  it('handles stack', () => {
    const memory = create(0xf);

    push(memory, Buffer.from([0x12, 0x34]));
    expect(pop(memory)).toStrictEqual(Buffer.from([0x12, 0x34]));
  });
});
