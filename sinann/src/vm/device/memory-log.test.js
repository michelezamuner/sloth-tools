const MemoryLog = require('./memory-log');

describe('memory log', () => {
  it('logs current state at each write', () => {
    const log = jest.fn();
    const memory = new MemoryLog(log);

    memory.write(0x00, [0x12, 0x34]);

    expect(log).toHaveBeenCalledWith('MEM: [0x12, 0x34]');

    memory.write(0x01, [0x56, 0x78]);

    expect(log).toHaveBeenCalledWith('MEM: [0x12, 0x56, 0x78]');
  });
});
