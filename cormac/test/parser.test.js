const { ast } = require('fion');
const { parse } = require('../src/parser');

describe('parser', () => {
  it('parses single function definition', () => {
    const code = 'fun main a := 0x12; a++';

    const a = parse(code);

    expect(a).toStrictEqual(ast.create([['main', [
      ['DEC', 'a', ['BYTE', 0x12]],
      ['RET', ['CALL', ['REF', 'INCR'], ['REF', 'a']]],
    ]]]));
  });
});
