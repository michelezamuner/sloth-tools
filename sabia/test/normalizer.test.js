const { normalize } = require('../src/normalizer');
const Lexer = require('../src/lexer');
const Parser = require('../src/parser/group');

describe('normalizer', () => {
  it('normalize inline program', () => {
    const code = `
      T = A
      T.A
    `;
    const lexemes = Lexer.parse(code);
    const ast = Parser.parse(lexemes);

    const normalizedAst = normalize(ast);

    const expectedAst = Parser.parse(Lexer.parse(`
      ::_
        dbg = ::core::lang::debug
        then = ::core::lang::then
        Proc = ::core::sys::Process
        Exit = ::core::sys::Exit
        main = _: Proc -> then (dbg T.A) Exit.OK
        T = A
    `));
    expect(normalizedAst).toStrictEqual(expectedAst);
  });
});
