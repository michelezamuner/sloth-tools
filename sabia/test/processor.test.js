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
    const index = Indexer.index(ast);
    const typedAst = Typer.type(ast, index);
    let buffer = undefined;
    const runtime = {
      process: {
        stdout: {
          write: msg => { buffer = msg; },
        },
      },
    };

    const status = process(runtime, typedAst, index);

    expect(status).toBe(0);
    expect(buffer).toBe('[T] A\n');
  });
});
