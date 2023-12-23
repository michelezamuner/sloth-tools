const { exec } = require('../src/lib');
const { parse } = require('./parser');
const fs = require('fs');
const stream = require('stream');

describe('etan', () => {
  it('execute source file', () => {
    const program = 'exit 0x12';
    fs.writeFileSync('/tmp/etan.sloth', program);

    const process = {
      argv: [null, null, '/tmp/etan.sloth'],
      exit: jest.fn(),
    };
    const config = { memory: 0xff };

    exec(process, parse, config);

    expect(process.exit).toBeCalledWith(0x12);
  });

  it('errors if invalid source file', () => {
    const process = {
      argv: [null, null, 'invalid'],
      stderr: { write: jest.fn() },
      exit: jest.fn(),
    };
    const config = { memory: 0xff };

    exec(process, parse, config);

    expect(process.stderr.write).toBeCalledWith('Invalid source file \'invalid\'\n');
    expect(process.exit).toBeCalledWith(1);
  });

  it('evals code from command line', () => {
    const process = {
      argv: [null, null, '--eval', 'exit 0x12'],
      exit: jest.fn(),
    };
    const config = { memory: 0xff };

    exec(process, parse, config);

    expect(process.exit).toBeCalledWith(0x12);
  });

  it('executes code in the repl', async() => {
    const outputs = [];
    const inputs = ['0x12\n', ':q\n', null];
    let readInput = 0;
    const process = {
      argv: [null, null, '--repl'],
      stdin: new stream.Readable({
        read() {
          this.push(inputs[readInput++]);
        }
      }),
      stdout: new stream.Writable({
        write(chunk, encoding, next) {
          outputs.push(chunk.toString());
          next();
        }
      }),
      exit: jest.fn(),
    };
    const config = { memory: 0xff };

    await exec(process, parse, config);

    expect(outputs).toStrictEqual(['> ', '18\n', '> ']);
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
