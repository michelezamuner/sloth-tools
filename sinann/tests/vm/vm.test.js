const { promisify } = require('util');
const { exec } = require('child_process');

describe('vm', () => {
  it('boots from rom that immediately exits', async() => {
    const conf = JSON.stringify({ firmware: 'tests/vm/firmware.js' });
    const result = await promisify(exec)(`bin/run --inline-conf '${conf}'`);

    const output = result.stdout
      .split('')
      .filter(char => char.charCodeAt(0) !== 0)
      .join('');

    expect(output).toBe('VM terminated\n');
  });
});
