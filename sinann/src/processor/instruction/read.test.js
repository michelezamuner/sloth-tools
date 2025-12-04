import Read from './read';

describe('read', () => {
  it('reads from bus address into accumulator', () => {
    const addr = 0x1234;
    const data = 0x5678;
    const processor = {
      accumulator: 0,
    };
    const bus = {
      read: a => {
        if (a === addr) {
          return data;
        }
      },
    };
    const instruction = new Read(processor, bus);

    instruction.exec(addr);

    expect(processor.accumulator).toBe(data);
  });
});
