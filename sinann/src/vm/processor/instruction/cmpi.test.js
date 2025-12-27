const Cmpi = require('./cmpi');

describe('cmpi', () => {
  it('compares register value equal to immediate value', async() => {
    const registers = { 0x00: [0x12, 0x34] };
    const instruction = new Cmpi(registers, {});

    await instruction.exec(0x00, 0x12, 0x34);

    expect(registers[0x00]).toStrictEqual([0x00, 0x00]);
  });

  it('compares register value less than immediate value', async() => {
    const registers = { 0x00: [0x12, 0x34] };
    const instruction = new Cmpi(registers, {});

    await instruction.exec(0x00, 0x12, 0x35);

    expect(registers[0x00]).toStrictEqual([0x00, 0x01]);
  });

  it('compares register value greater than immediate value', async() => {
    const registers = { 0x00: [0x12, 0x34] };
    const instruction = new Cmpi(registers, {});

    await instruction.exec(0x00, 0x12, 0x33);

    expect(registers[0x00]).toStrictEqual([0x00, 0x02]);
  });
});
