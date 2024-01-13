const Expr = require('../src/expr');
const Stmt = require('../src/stmt');

describe('ret', () => {
  it('creates statement from ast', () => {
    const expected = Stmt.create(['RET', ['BYTE', 0x12]]);

    const ast = Stmt.create(expected);

    expect(ast).toStrictEqual(expected);
  });

  it('creates return statement', () => {
    const retDsl = Stmt.create(['RET', ['BYTE', 0x12]]);
    const retAst = Stmt.create(['RET', Expr.create(['BYTE', 0x12])]);
    const expected = { type: Stmt.RET, expr: { type: Expr.BYTE, val: Buffer.from([0x12]) } };

    expect(retDsl).toStrictEqual(expected);
    expect(retAst).toStrictEqual(expected);
  });

  it('creates declaration statement', () => {
    const decDsl = Stmt.create(['DEC', 'a', ['BYTE', 0x12]]);
    const decAst = Stmt.create(['DEC', 'a', Expr.create(['BYTE', 0x12])]);
    const expected = { type: Stmt.DEC, var: 'a', expr: { type: Expr.BYTE, val: Buffer.from([0x12]) } };

    expect(decDsl).toStrictEqual(expected);
    expect(decAst).toStrictEqual(expected);
  });

  it('creates assignment statement', () => {
    const asmDsl = Stmt.create(['ASM', ['VAR', 'a'], ['BYTE', 0x12]]);
    const asmAst = Stmt.create(['ASM', Expr.create(['VAR', 'a']), Expr.create(['BYTE', 0x12])]);
    const expected = { type: Stmt.ASM, var: { type: Expr.VAR, var: 'a' }, expr: { type: Expr.BYTE, val: Buffer.from([0x12]) } };

    expect(asmDsl).toStrictEqual(expected);
    expect(asmAst).toStrictEqual(expected);
  });

  it('errors on invalid statement', () => {
    expect(() => Stmt.create(['INVALID'])).toThrow('Invalid statement \'INVALID\'');
  });

  it('errors on statement with invalid format', () => {
    expect(() => Stmt.create([[]])).toThrow('Invalid statement: first element must be statement type, found \'[]\'');
  });
});
