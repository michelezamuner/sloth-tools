const { Ast } = require('fion');

const { parse } = require('../src/parser');

describe('parser', () => {
  it('parses whole program', () => {
    const { ast: ast } = parse('0x12');

    expect(ast).toStrictEqual(Ast.create([['main', [['RET', ['BYTE', 0x12]]]]]));
  });
});
