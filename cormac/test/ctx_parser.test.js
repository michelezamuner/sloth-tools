const { ast } = require('fion');
const { parse } = require('../src/ctx_parser');

describe('context parser', () => {
  it('parses normal code', () => {
    const { ast: a } = parse('fun main 0x12');

    expect(a).toStrictEqual(ast.create([['main', [['RET', ['BYTE', 0x12]]]]]));
  });

  it('parses just a value', () => {
    const { ast: a } = parse('0x12');

    expect(a).toStrictEqual(ast.create([['main', [['RET', ['BYTE', 0x12]]]]]));
  });

  it('parses lines with declaration', () => {
    const lines = [
      [
        'a := 0x12',
        ast.create([['main', [
          ['DEC', 'a', ['BYTE', 0x12]],
          ['RET', ['BYTE', 0x00]],
        ]]]),
      ],
      [
        'a',
        ast.create([['main', [
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
