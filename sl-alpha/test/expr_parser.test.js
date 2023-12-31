const ExprParser = require('../src/expr_parser');

describe('expression parser', () => {
  let parser = null;

  beforeEach(() => {
    parser = new ExprParser();
  });

  it('parses function references', () => {
    const lexemes = ['my.fun'];
    const ast = parser.parse(lexemes);

    expect(ast).toStrictEqual({ obj: 'ref', ref: 'my.fun' });
  });

  it('parses scalar literals', () => {
    const lexemes = ['0'];
    const ast = parser.parse(lexemes);

    expect(ast).toStrictEqual({ obj: 'val', val: '0' });
  });

  it('parses expressions', () => {
    const lexemes = ['fun', 'val1', 'val2'];
    const ast = parser.parse(lexemes);

    expect(ast).toStrictEqual({
      obj: 'expr',
      fun: { obj: 'ref', ref: 'fun' },
      args: [
        { obj: 'ref', ref: 'val1' },
        { obj: 'ref', ref: 'val2' },
      ],
    });
  });

  it('parses expressions where functions are nested asts', () => {
    const nestedAst = { obj: 'ast' };
    const lexemes = [nestedAst, 'a'];
    const ast = parser.parse(lexemes);

    expect(ast).toStrictEqual({
      obj: 'expr',
      fun: { obj: 'ast' },
      args: [{ obj: 'ref', ref: 'a' }],
    });
  });

  it('parses expressions where arguments are nested asts', () => {
    const nestedAst = { obj: 'ast' };
    const lexemes = ['f', 'a', nestedAst];
    const ast = parser.parse(lexemes);

    expect(ast).toStrictEqual({
      obj: 'expr',
      fun: { obj: 'ref', ref: 'f' },
      args: [
        { obj: 'ref', ref: 'a' },
        { obj: 'ast' },
      ],
    });
  });

  it('parses function literals', () => {
    const lexemes = ['arg1', 'arg2', '->', 'fun', 'arg1', 'arg2'];
    const ast = parser.parse(lexemes);

    expect(ast).toStrictEqual({
      obj: 'fun',
      args: [
        { obj: 'arg', arg: 'arg1' },
        { obj: 'arg', arg: 'arg2' },
      ],
      body: {
        obj: 'expr',
        fun: { obj: 'ref', ref: 'fun' },
        args: [
          { obj: 'ref', ref: 'arg1' },
          { obj: 'ref', ref: 'arg2' },
        ],
      },
    });
  });
});
