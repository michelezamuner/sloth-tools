const { Ast } = require('fion');

const { parse } = require('../src/parser');

describe('parser', () => {
  it('parses program', () => {
    const { ast: ast } = parse('fun main a := 0x12; a++');

    expect(ast).toStrictEqual(Ast.create([['main', [
      ['DEC', 'a', ['BYTE', 0x12]],
      ['RET', ['CALL', ['REF', 'INCR'], ['REF', 'a']]],
    ]]]));
  });

  it('parses single value', () => {
    const { ast: ast } = parse('0x12');

    expect(ast).toStrictEqual(Ast.create([['main', [['RET', ['BYTE', 0x12]]]]]));
  });

  it('parses program with no explicit return', () => {
    const { ast: ast } = parse('a := 0x12');

    expect(ast).toStrictEqual(Ast.create([['main', [
      ['DEC', 'a', ['BYTE', 0x12]],
      ['RET', ['BYTE', 0x00]],
    ]]]));
  });

  it('parses lines with declaration', () => {
    const lines = [
      [
        'a := 0x12',
        Ast.create([['main', [
          ['DEC', 'a', ['BYTE', 0x12]],
          ['RET', ['BYTE', 0x00]],
        ]]]),
      ],
      [
        'a',
        Ast.create([['main', [
          ['DEC', 'a', ['BYTE', 0x12]],
          ['RET', ['REF', 'a']],
        ]]]),
      ],
    ];

    let ctx = [];
    for (const [line, expected] of lines) {
      const { ast: a, ctx: c } = parse(line, ctx);
      ctx = c;

      expect(a).toStrictEqual(expected);
    }
  });
});
