const { bytecode } = require('fedelm');
const { exec } = require('../src/executor');

describe('executor', () => {
  it('executes exit_i', () => {
    const operands = Buffer.from([0x12]);

    const result = exec(bytecode('exit_i'), operands);

    expect(result).toStrictEqual({ exit: 0x12 });
  });
});
