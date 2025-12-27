const Writei = require('./writei');

describe('writei', () => {
  it('writes from register into an immediate address', async() => {
    const registers = { 0x00: [0x56, 0x78] };
    const bus = {
      write: async(a, d) => {
        expect(a).toBe(0x1234);
        expect(d).toStrictEqual([0x56, 0x78]);
      },
    };
    const instruction = new Writei(registers, bus);

    instruction.exec(0x00, 0x12, 0x34);

    expect.hasAssertions();
  });
});
