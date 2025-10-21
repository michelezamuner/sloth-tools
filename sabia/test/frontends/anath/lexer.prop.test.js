const Lexer = require('../../../src/frontends/anath/lexer');
const Props = require('./props');

const P = 0.1;

describe('anath lexer', () => {
  it.each(Props.ref_exps())('parses ref exp `$code`', ({ code, lex }) => {
    const lexemes = Lexer.parse(code);

    expect(lexemes).toStrictEqual(lex);
  });

  it.each(Props.cons_exps())('parses cons exp `$code`', ({ code, lex }) => {
    const lexemes = Lexer.parse(code);

    expect(lexemes).toStrictEqual(lex);
  });

  it.each(Props.fun_exps(P / 100))('parses fun exp `$code`', ({ code, lex }) => {
    const lexemes = Lexer.parse(code);

    expect(lexemes).toStrictEqual(lex);
  });

  it.each(Props.eval_exps(P / 50))('parses eval exp `$code`', ({ code, lex }) => {
    const lexemes = Lexer.parse(code);

    expect(lexemes).toStrictEqual(lex);
  });

  it.each(Props.type_defs())('parses type def `$code`', ({ code, lex }) => {
    const lexemes = Lexer.parse(code);

    expect(lexemes).toStrictEqual(lex);
  });

  it.each(Props.ref_defs(P))('parses ref def `$code`', ({ code, lex }) => {
    const lexemes = Lexer.parse(code);

    expect(lexemes).toStrictEqual(lex);
  });

  it.each(Props.mod_defs(P / 10))('parses mod def `$code`', ({ code, lex }) => {
    const lexemes = Lexer.parse(code);

    expect(lexemes).toStrictEqual(lex);
  });
});
