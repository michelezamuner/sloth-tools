const Frontend = require('../src/frontends/anath/frontend');
const Compiler = require('../src/compiler');
const Processor = require('../src/processor');

describe('processor', () => {
  it('processes enum expression', () => {
    const code = 'Bit = 0 | 1; Bit::0;';
    const ast = Frontend.parse(code);
    const index = Compiler.compile(ast);
    const runtime = {
      process: {
        stdout: { write: jest.fn() },
      },
    };

    const status = Processor.process(runtime, index);

    expect(status).toBe(0);
    expect(runtime.process.stdout.write).toHaveBeenCalledWith('[app::Bit] 0\n');
  });

  it('processes enum expression with arg', () => {
    const code = 'Bit = 0 | 1; Cons = Cons Bit; Cons::Cons Bit::0;';
    const ast = Frontend.parse(code);
    const index = Compiler.compile(ast);
    const runtime = {
      process: {
        stdout: { write: jest.fn() },
      },
    };

    const status = Processor.process(runtime, index);

    expect(status).toBe(0);
    expect(runtime.process.stdout.write).toHaveBeenCalledWith('[app::Cons] Cons [app::Bit] 0\n');
  });

  it('processes id expression', () => {
    const code = 'Bit = 0 | 1; a = Bit::0; a;';
    const ast = Frontend.parse(code);
    const index = Compiler.compile(ast);
    const runtime = {
      process: {
        stdout: { write: jest.fn() },
      },
    };

    const status = Processor.process(runtime, index);

    expect(status).toBe(0);
    expect(runtime.process.stdout.write).toHaveBeenCalledWith('[app::Bit] 0\n');
  });
});
