const OutputLog = require('./output-log');

describe('output log', () => {
  it('declares device type', async() => {
    const device = new OutputLog();

    const output = await device.read(0x00);

    // Device type "output"
    expect(output).toStrictEqual([0x00, 0x00]);
  });

  it('logs reads and writes', () => {
    const log = jest.fn();
    const device = new OutputLog(log);

    device.write(0x00, [0x34, 0x56]);
    expect(log).toHaveBeenCalledWith('WRITE: 0x00, [0x34, 0x56]');
  });
});
