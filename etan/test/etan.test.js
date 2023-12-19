const { exec } = require('../src/lib');
const { parse } = require('./parser');

describe('etan', () => {
  it('evals code from command line', () => {
    const process = {
      argv: [null, null, '--eval', 'exit 0x12'],
      exit: jest.fn(),
    };
    const config = { memory: 0xff };

    exec(process, parse, config);

    expect(process.exit).toBeCalledWith(0x12);
  });

  it('errors if invalid option', () => {
    const process = {
      argv: [null, null, '--invalid'],
      stderr: { write: jest.fn() },
      exit: jest.fn(),
    };

    exec(process);

    expect(process.stderr.write).toBeCalledWith('Invalid option \'--invalid\'\n');
    expect(process.exit).toBeCalledWith(1);
  });
});
