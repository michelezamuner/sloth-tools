const Lexer = require('../src/lexer');

describe('lexer', () => {
  let lexer = null;

  beforeEach(() => {
    lexer = new Lexer();
  });

  it('parses references and values', () => {
    const code = 'val';
    const lexemes = lexer.parse(code);

    expect(lexemes).toStrictEqual(['val']);
  });

  it('parses expressions', () => {
    const code = 'fun val1 val2';
    const lexemes = lexer.parse(code);

    expect(lexemes).toStrictEqual(['fun', 'val1', 'val2']);
  });

  it('parses function literals', () => {
    const code = 'arg1 arg2 -> fun arg1 arg2';
    const lexemes = lexer.parse(code);

    expect(lexemes).toStrictEqual(['arg1', 'arg2', '->', 'fun', 'arg1', 'arg2']);
  });

  it('parses function literals without white space around the arrow', () => {
    const code = 'arg1 arg2->fun arg1 arg2';
    const lexemes = lexer.parse(code);

    expect(lexemes).toStrictEqual(['arg1', 'arg2', '->', 'fun', 'arg1', 'arg2']);
  });

  it('parses definitions', () => {
    const code = 'res := fun val1 val2';
    const lexemes = lexer.parse(code);

    expect(lexemes).toStrictEqual(['res', ':=', 'fun', 'val1', 'val2']);
  });

  it('parses definitions without white space around the colon', () => {
    const code = 'res:=fun val1 val2';
    const lexemes = lexer.parse(code);

    expect(lexemes).toStrictEqual(['res', ':=', 'fun', 'val1', 'val2']);
  });

  it('parses type applications', () => {
    const code = '@ _ _ -> std.sys.proc.exit_status _:= _ _ -> 0';
    const lexemes = lexer.parse(code);

    expect(lexemes).toStrictEqual(['@', '_', '_', '->', 'std.sys.proc.exit_status', '_', ':=', '_', '_', '->', '0']);
  });

  it('parses type definitions', () => {
    const code = '@ std.sys.proc.exit_status:= std.num.uint8';
    const lexemes = lexer.parse(code);

    expect(lexemes).toStrictEqual(['@', 'std.sys.proc.exit_status', ':=', 'std.num.uint8']);
  });
});
