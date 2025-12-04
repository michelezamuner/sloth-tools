import Noop from './noop';

describe('noop', () => {
  it('does nothing when executed', () => {
    const instruction = new Noop();

    instruction.exec();

    expect.assertions(0);
  });
});
