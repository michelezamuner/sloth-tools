const { run } = require('../src/lib');
const { parse } = require('fedelm');
const memory = require('../src/memory');

describe('heber', () => {
  it('returns program exit status', () => {
    const code = parse('exit_i 0x12');
    const mem = memory.create(0xff);

    memory.load(mem, code);

    const status = run(mem);

    expect(status).toBe(0x12);
  });
});
