const { Ast } = require('fion');

const { parse } = require('../src/parser');

describe('parser', () => {
  it('parses program', () => {
    const { ast: ast } = parse('fun main a := 0x12; ret a');

    expect(ast).toStrictEqual(Ast.create([['main', [
      ['DEC', 'a', ['BYTE', 0x12]],
      ['RET', ['REF', 'a']],
    ]]]));
  });
});
