const { ast } = require('fion');
const { parse } = require('../src/parser');

describe('parser', () => {
  it('parses program with exit call', () => {
    const code = 'exit(0x12)';

    const a = parse(code);

    expect(a).toStrictEqual(ast.create({ 'main': { 'RET': [ 'REF', '0x12' ] } }));
  });
});
