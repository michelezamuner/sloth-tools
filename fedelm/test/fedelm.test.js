const { mnemonics, parse } = require('../src/lib');

describe('fedelm', () => {
  it('provides mnemonics for opcodes', () => {
    expect(mnemonics(0x00)).toBe('exit_i');
  });

  it('parses code with mnemonics into bytecode', () => {
    expect(parse('    ')).toStrictEqual(Buffer.from([]));
    expect(parse('exit_i')).toStrictEqual(Buffer.from([0x00]));
    expect(parse('exit_i exit_i')).toStrictEqual(Buffer.from([0x00, 0x00]));
  });
});
