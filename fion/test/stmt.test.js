const stmt = require('../src/stmt');
const expr = require('../src/expr');

describe('ret', () => {
  it('creates statement from ast', () => {
    const expected = stmt.create(['RET', ['BYTE', 0x12]]);

    const ast = stmt.create(expected);

    expect(ast).toStrictEqual(expected);
  });

  it('creates return statement', () => {
    const retDsl = stmt.create(['RET', ['BYTE', 0x12]]);
    const retAst = stmt.create(['RET', expr.create(['BYTE', 0x12])]);
    const expected = { type: stmt.RET, expr: { type: expr.BYTE, val: Buffer.from([0x12]) } };

    expect(retDsl).toStrictEqual(expected);
    expect(retAst).toStrictEqual(expected);
  });

  it('creates declaration statement', () => {
    const decDsl = stmt.create(['DEC', 'a', ['BYTE', 0x12]]);
    const decAst = stmt.create(['DEC', 'a', expr.create(['BYTE', 0x12])]);
    const expected = { type: stmt.DEC, var: 'a', expr: { type: expr.BYTE, val: Buffer.from([0x12]) } };

    expect(decDsl).toStrictEqual(expected);
    expect(decAst).toStrictEqual(expected);
  });

  it('creates assignment statement', () => {
    const asmDsl = stmt.create(['ASM', ['VAR', 'a'], ['BYTE', 0x12]]);
    const asmAst = stmt.create(['ASM', expr.create(['VAR', 'a']), expr.create(['BYTE', 0x12])]);
    const expected = { type: stmt.ASM, var: { type: expr.VAR, var: 'a' }, expr: { type: expr.BYTE, val: Buffer.from([0x12]) } };

    expect(asmDsl).toStrictEqual(expected);
    expect(asmAst).toStrictEqual(expected);
  });

  it('errors on invalid statement', () => {
    expect(() => stmt.create(['INVALID'])).toThrow('Invalid statement \'INVALID\'');
  });
});
