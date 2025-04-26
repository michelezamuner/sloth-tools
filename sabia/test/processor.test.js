const { process } = require('../src/processor');
const Lexer = require('../src/lexer');
const Parser = require('../src/parser/group');
const Indexer = require('../src/indexer');
const Typer = require('../src/typer');

describe('processor', () => {
  it('processes main function', () => {
    const code = `
      ::_
        then = ::core::lang::then
        dbg = ::core::lang::debug
        Proc = ::core::sys::Process
        Exit = ::core::sys::Exit
        T = A
        main = _: Proc -> then (dbg T.A) Exit.OK
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
