const Write = require('./write');

describe('write', () => {
  it('writes register data into memory pointed to by register', async() => {
    const registers = { 0x00: [0x12, 0x34], 0x01: [0x56, 0x78] };
    const bus = {
      write: jest.fn(),
    };
    const instruction = new Write(registers, bus);

    await instruction.exec(0x00, 0x01, 0x00);

    expect(bus.write).toHaveBeenCalledWith(0x1234, [0x56, 0x78]);
  });
});
