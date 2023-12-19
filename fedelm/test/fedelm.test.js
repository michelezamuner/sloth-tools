const { bytecode, instruction, parse } = require('../src/lib');

describe('fedelm', () => {
  it('provides instruction description by opcode', () => {
    expect(instruction(0x00)).toStrictEqual({ mnemonic: 'exit_i', operands: 1 });
  });

  it('provides bytecode from mnemonic', () => {
    expect(bytecode('exit_i')).toBe(0x00);
  });

  it('parses empty code', () => {
    expect(parse('    ')).toStrictEqual(Buffer.from([]));
  });

  it('parses exit_i instruction', () => {
    expect(parse('exit_i 0x12')).toStrictEqual(Buffer.from([0x00, 0x12]));
    expect(() => parse('exit_i')).toThrow('Instruction \'exit_i\' expects 1 operands');
    expect(() => parse('exit_i exit_i')).toThrow('Instruction \'exit_i\' expects 1 operands');
  });
});
