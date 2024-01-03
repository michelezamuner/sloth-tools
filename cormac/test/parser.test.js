const { ast } = require('fion');
const { parse } = require('../src/parser');

describe('parser', () => {
  it('parses single expression', () => {
    const code = '0x12++';

    const a = parse(code);

    expect(a).toStrictEqual(ast.create({ 'main': [['RET', ['CALL', ['REF', 'INCR'], ['BYTE', 0x12]]]] }));
  });

  it('parses multiple statements', () => {
    const code = 'a = 0x12; a';

    const a = parse(code);

    expect(a).toStrictEqual(ast.create({ 'main': [
      ['ASM', ['VAR', 'a'], ['BYTE', 0x12]],
      ['RET', ['REF', 'a']],
    ]}));
  });
});
