const Noop = require('./noop');

describe('noop', () => {
  it('does nothing when executed', async() => {
    const instruction = new Noop({}, {});

    await instruction.exec();

    expect.assertions(0);
  });
});
