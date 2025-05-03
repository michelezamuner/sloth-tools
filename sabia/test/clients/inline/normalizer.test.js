const { normalize } = require('../../../src/clients/inline/normalizer');
const Lexer = require('../../../src/lexer');
const Parser = require('../../../src/parser/group');

describe('normalizer', () => {
  it('normalize inline program', () => {
    const code = `
      T = A
      T.A
    `;
    const lexemes = Lexer.parse(code);
    const ast = Parser.parse(lexemes);

    const normalizedAst = normalize(ast, '::mod::main');

    const expectedAst = Parser.parse(Lexer.parse(`
      ::mod =
        main = _: ::core::sys::Process -> ::core::lang::then (::core::lang::debug T.A) ::core::sys::Exit.OK
        T = A
    `));
    expect(normalizedAst).toStrictEqual(expectedAst);
  });
});
