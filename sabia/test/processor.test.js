const { process } = require('../src/processor');
const Lexer = require('../src/lexer');
const Parser = require('../src/parser');
const Indexer = require('../src/indexer');
const Typer = require('../src/typer');

describe('processor', () => {
  it('processes main function', () => {
    const code = `
      dbg: .core.lang.debug
      A: A
      main: A -> A = _ -> dbg A
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

    process(runtime, typedAst, index);

    expect(buffer).toBe('[A] A\n');
  });
});
