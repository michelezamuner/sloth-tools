const { process } = require('../src/processor');
const Lexer = require('../src/lexer');
const Parser = require('../src/parser/group');
const Indexer = require('../src/indexer');
const Typer = require('../src/typer');

describe('processor', () => {
  it('processes main function', () => {
    const code = `
      ::_ =
        T = A
        main = _: ::core::sys::Process ->
          ::core::lang::then
            (::core::lang::debug T.A)
            ::core::sys::Exit.OK
    `;
    const lexemes = Lexer.parse(code);
    const ast = Parser.parse(lexemes);
    const index = Typer.type(Indexer.index(ast));
    let buffer = undefined;
    const runtime = {
      process: {
        stdout: {
          write: msg => { buffer = msg; },
        },
      },
    };

    const status = process(runtime, index, '::_::main');

    expect(status).toBe(0);
    expect(buffer).toBe('[::_::T] A\n');
  });
});
