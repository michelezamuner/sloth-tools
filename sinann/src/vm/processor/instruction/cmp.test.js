const Cmp = require('./cmp');

describe('cmp', () => {
  it('compares register value equal to register value', async() => {
    const registers = { 0x00: [0x12, 0x34], 0x01: [0x12, 0x34] };
    const instruction = new Cmp(registers, {});

    await instruction.exec(0x00, 0x01);

    expect(registers[0x00]).toStrictEqual([0x00, 0x00]);
  });

  it('compares register value less than register value', async() => {
    const registers = { 0x00: [0x12, 0x34], 0x01: [0x12, 0x35] };
    const instruction = new Cmp(registers, {});

    await instruction.exec(0x00, 0x01);

    expect(registers[0x00]).toStrictEqual([0x00, 0x01]);
  });

  it('compares register value greater than register value', async() => {
    const registers = { 0x00: [0x12, 0x34], 0x01: [0x12, 0x33] };
    const instruction = new Cmp(registers, {});

    await instruction.exec(0x00, 0x01);

    expect(registers[0x00]).toStrictEqual([0x00, 0x02]);
  });
});
