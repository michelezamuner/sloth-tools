const { code, instruction, parse } = require('../src/lib');
const instructions = require('../src/instructions.json');
const registers = require('../src/registers.json');

describe('fedelm', () => {
  it('provides instructions by opcode', () => {
    for (const inst of instructions) {
      expect(instruction(+inst.code)).toStrictEqual({ mnemonic: inst.mnemonic, operands: inst.operands });
    }
  });

  it('provides bytecode from mnemonics', () => {
    for (const inst of instructions) {
      expect(code(inst.mnemonic)).toBe(+inst.code);
    }
    for (const register of registers) {
      expect(code(register.mnemonic)).toBe(+register.code);
    }
  });

  it('parses empty code', () => {
    expect(parse('    ')).toStrictEqual(Buffer.from([]));
  });

  it('parses instruction', () => {
    expect(parse('set_i a 0x12 0x34')).toStrictEqual(Buffer.from([code('set_i'), code('a'), 0x12, 0x34]));
    expect(() => parse('set_i')).toThrow('Instruction \'set_i\' expects 3 bytes operands');
    expect(() => parse('set_i a')).toThrow('Instruction \'set_i\' expects 3 bytes operands');
    expect(() => parse('set_i a 0x12')).toThrow('Instruction \'set_i\' expects 3 bytes operands');
    expect(() => parse('set_i 0x00 0x12 0x34')).toThrow('Instruction \'set_i\' expects operand 0 to be a register');
    expect(() => parse('set_i a a 0x34')).toThrow('Instruction \'set_i\' expects operand 1 to be a value');
    expect(() => parse('set_i a 0x12 a')).toThrow('Instruction \'set_i\' expects operand 2 to be a value');
  });

  it('errors if invalid instruction', () => {
    expect(() => parse('invalid')).toThrow('Invalid instruction \'invalid\'');
  });
});
