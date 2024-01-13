const instructions = require('../src/instructions.json');
const { code, decode, instruction, parse } = require('../src/lib');
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

  it('decodes bytecode', () => {
    const code = decode(Buffer.from([0x10, 0x00, 0x12, 0x34, 0x01, 0x00]));
    expect(code).toStrictEqual(`
      set_i a 0x12 0x34
      exit a
    `.split('\n').map(l => l.trim()).join('\n').trim());
  });

  it('decodes bytecode with invalid instruction', () => {
    expect(() => decode(Buffer.from([0xff]))).toThrow('Invalid instruction opcode \'0xff\'');
  });

  it('decodes bytecode with invalid register', () => {
    expect(() => decode(Buffer.from([0x01, 0xff]))).toThrow('Invalid register opcode \'0xff\'');
  });
});
