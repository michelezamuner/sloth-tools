const Frontend = require('../src/frontends/anath/frontend');
const Compiler = require('../src/compiler');
const Processor = require('../src/processor');

describe('processor', () => {
  it('processes enum expression', () => {
    const code = 'T = A; T::A;';
    const ast = Frontend.parse(code);
    const index = Compiler.compile(ast);
    const runtime = {
      process: {
        stdout: { write: jest.fn() },
      },
    };

    const status = Processor.process(runtime, index);

    expect(status).toBe(0);
    expect(runtime.process.stdout.write).toHaveBeenCalledWith('[app::T] A\n');
  });

  it('processes id expression', () => {
    const code = 'T = A; a = T::A; a;';
    const ast = Frontend.parse(code);
    const index = Compiler.compile(ast);
    const runtime = {
      process: {
        stdout: { write: jest.fn() },
      },
    };

    const status = Processor.process(runtime, index);

    expect(status).toBe(0);
    expect(runtime.process.stdout.write).toHaveBeenCalledWith('[app::T] A\n');
  });
});
