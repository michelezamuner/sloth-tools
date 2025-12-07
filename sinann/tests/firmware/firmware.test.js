const { promisify } = require('util');
const { exec } = require('child_process');

describe('firmware', () => {
  it('initialize address list in memory', async() => {
    const conf = JSON.stringify({
      memory: { type: 'memory-log' },
      firmware: 'src/firmware/firmware.js',
    });
    const result = await promisify(exec)(`bin/run --inline-conf '${conf}'`);

    const output = result.stdout
      .split('')
      .filter(char => char.charCodeAt(0) !== 0)
      .join('');

    expect(output).toMatch('MEM: [0x02, 0x06, 0x02, 0x1a]\nVM terminated\n');
  });
});
