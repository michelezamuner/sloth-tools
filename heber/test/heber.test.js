const { run } = require('../src/lib');
const { parse } = require('fedelm');

describe('heber', () => {
  it('returns program exit status', () => {
    const code = parse('exit_i 0x00');

    const status = run(code, { memory: 0xff });

    expect(status).toBe(0x00);
  });

  it('executes instructions in sequence', () => {
    const code = parse('set_i a 0x00 0x12 incr a exit a');

    const status = run(code, { memory: 0xff });

    expect(status).toBe(0x13);
  });
});
