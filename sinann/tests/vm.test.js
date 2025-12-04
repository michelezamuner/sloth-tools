import { promisify } from 'util';
import { exec } from 'child_process';

describe('vm', () => {
  it('boots from rom that immediately exits', async() => {
    const result = await promisify(exec)('bin/run');

    const output = result.stdout
      .split('')
      .filter(char => char.charCodeAt(0) !== 0)
      .join('');

    expect(output).toBe('VM terminated\n');
  });
});
