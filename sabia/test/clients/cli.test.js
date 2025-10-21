const Client = require('../../src/clients/cli');

describe('inline client', () => {
  it('exec inline program', () => {
    const code = 'T = A; T::A;';

    const process = {
      argv: [null, null, '--inline', code],
      env: { SLOTH_LANG: 'anath' },
      stdout: {
        write: jest.fn(),
      }
    };

    const result = Client.exec(process);

    expect(result).toBe(0);
    expect(process.stdout.write).toHaveBeenCalledWith('[app::T] A\n');
  });
});
