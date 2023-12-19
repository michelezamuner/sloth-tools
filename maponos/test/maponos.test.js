const { compile } = require('../src/lib');
const { ast } = require('fion');
const { parse } = require('fedelm');

describe('maponos', () => {
  it('produces program that exits with constant', () => {
    const a = ast.create({ 'main': { 'RET': [ 'REF', '0x12' ] } });

    const object = compile(a);

    expect(object).toStrictEqual(parse(`
      exit_i 0x12
    `));
  });
});
