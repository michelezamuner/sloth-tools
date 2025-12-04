import Put from './put';

describe('put', () => {
  it('writes data into accumulator', () => {
    const data = 0x1234;
    const processor = {
      accumulator: 0,
    };
    const instruction = new Put(processor);

    instruction.exec(data);

    expect(processor.accumulator).toBe(data);
  });
});
