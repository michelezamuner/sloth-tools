const { create, load, read } = require('../src/memory');

describe('memory', () => {
  it('creates memory of specific size', () => {
    const memory = create(0x4);

    expect(memory).toStrictEqual(Buffer.from([0, 0, 0, 0]));
  });

  it('loads code', () => {
    const code = Buffer.from([0x9a, 0x8b, 0x7c, 0x6d, 0x5e, 0x4f]);
    const memory = create(0x8);

    load(memory, code);

    expect(memory).toStrictEqual(Buffer.from([0x9a, 0x8b, 0x7c, 0x6d, 0x5e, 0x4f, 0x00, 0x00]));
  });

  it('reads bytes', () => {
    const memory = Buffer.from([0x00, 0x12, 0x23, 0x34]);

    expect(read(memory, 0)).toStrictEqual(Buffer.from([0x00]));
    expect(read(memory, 1)).toStrictEqual(Buffer.from([0x12]));
    expect(read(memory, 2)).toStrictEqual(Buffer.from([0x23]));
    expect(read(memory, 3)).toStrictEqual(Buffer.from([0x34]));
  });
});
