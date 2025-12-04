import Write from './write';

describe('write', () => {
  it('writes from accumulator into a bus address', () => {
    const addr = 0x1234;
    const data = 0x5678;
    const processor = {
      accumulator: data,
    };
    const bus = {
      write: (a, d) => {
        expect(a).toBe(addr);
        expect(d).toBe(data);
      },
    };
    const instruction = new Write(processor, bus);

    instruction.exec(addr);

    expect.hasAssertions();
  });
});
