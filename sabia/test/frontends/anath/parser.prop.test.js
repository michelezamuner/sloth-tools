const Lexer = require('../../../src/frontends/anath/lexer');
const Parser = require('../../../src/frontends/anath/parser');
const Props = require('./props');

const P = 0.1;

describe('anath parser', () => {
  it.each(Props.ref_exps())('parses ref exp `$code`', ({ code, ast }) => {
    const lexemes = Lexer.parse(code);

    const result = Parser.parse(lexemes);

    expect(result).toStrictEqual(ast);
  });

  it.each(Props.cons_exps())('parses cons exp `$code`', ({ code, ast }) => {
    const lexemes = Lexer.parse(code);

    const result = Parser.parse(lexemes);

    expect(result).toStrictEqual(ast);
  });

  it.each(Props.fun_exps(P / 100))('parses fun exp `$code`', ({ code, ast }) => {
    const lexemes = Lexer.parse(code);

    const result = Parser.parse(lexemes);

    expect(result).toStrictEqual(ast);
  });

  it.each(Props.eval_exps(P / 50))('parses eval exp `$code`', ({ code, ast }) => {
    const lexemes = Lexer.parse(code);

    const result = Parser.parse(lexemes);

    expect(result).toStrictEqual(ast);
  });

  it.each(Props.type_defs())('parses type def `$code`', ({ code, ast }) => {
    const lexemes = Lexer.parse(code);

    const result = Parser.parse(lexemes);

    expect(result).toStrictEqual(ast);
  });

  it.each(Props.ref_defs(P))('parses ref def `$code`', ({ code, ast }) => {
    const lexemes = Lexer.parse(code);

    const result = Parser.parse(lexemes);

    expect(result).toStrictEqual(ast);
  });

  it.each(Props.mod_defs(P / 10))('parses mod def `$code`', ({ code, ast }) => {
    const lexemes = Lexer.parse(code);

    const result = Parser.parse(lexemes);

    expect(result).toStrictEqual(ast);
  });
});
