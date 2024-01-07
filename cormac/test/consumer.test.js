const { ast } = require('fion');
const { parse } = require('../src/parser');
const { consume } = require('../src/consumer');

describe('consumer', () => {
  it('consumes line', () => {
    const input = parse('0x12');

    const { ast: a } = consume(input);

    expect(a).toStrictEqual(ast.create({ 'main': [['RET', ['BYTE', 0x12]]] }));
  });

  it('consumes lines with declaration', () => {
    const lines = [
      [
        parse('a := 0x12'),
        ast.create({ 'main': [
          ['DEC', 'a', ['BYTE', 0x12]],
          ['RET', ['BYTE', 0x00]],
        ]}),
      ],
      [
        parse('a'),
        ast.create({ 'main': [
          ['DEC', 'a', ['BYTE', 0x12]],
          ['RET', ['REF', 'a']],
        ] }),
      ],
    ];

    let ctx = [];
    for (const [input, expected] of lines) {
      const { ast: a, ctx: c } = consume(input, ctx);
      ctx = c;

      expect(a).toStrictEqual(expected);
    }
  });
});
