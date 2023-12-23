const { ast } = require('fion');
const { parse } = require('../src/parser');

describe('parser', () => {
  it('parses single expression', () => {
    const code = '0x12++';

    const a = parse(code);

    expect(a).toStrictEqual(ast.create({ 'main': { 'RET': ['CALL', ['REF', 'INCR'], [ 'BYTE', 0x12 ]] } }));
  });
});
