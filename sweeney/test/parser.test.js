const { Ast, Stmt } = require('fion');

const { parse } = require('../src/parser');

describe('parser', () => {
  it('parses program', () => {
    const { ast: ast, ctx: ctx } = parse('var a 0x12; a = a++; a');

    expect(ast).toStrictEqual(Ast.create([[
      'main',
      [
        ['DEC', 'a', ['BYTE', 0x12]],
        ['ASM', ['REF', 'a'], ['CALL', ['REF', 'INCR'], ['REF', 'a']]],
        ['RET', ['REF', 'a']],
      ],
    ]]));

    expect(ctx).toStrictEqual([
      Stmt.create(['DEC', 'a', ['BYTE', 0x12]]),
      Stmt.create(['ASM', ['REF', 'a'], ['CALL', ['REF', 'INCR'], ['REF', 'a']]]),
    ]);
  });

  it('parses lines with declaration', () => {
    const lines = [
      [
        'var a 0x12',
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

  it('parses lines with assignment', () => {
    const lines = [
      [
        'a = 0x12',
        Ast.create([['main', [
          ['ASM', ['REF', 'a'], ['BYTE', 0x12]],
          ['RET', ['BYTE', 0x00]],
        ]]]),
      ],
      [
        'a',
        Ast.create([['main', [
          ['ASM', ['REF', 'a'], ['BYTE', 0x12]],
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
