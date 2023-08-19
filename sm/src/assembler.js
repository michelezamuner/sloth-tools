module.exports = class Assembler {
  constructor() {
    this._mnemonics = {
      'a': 0x00,
      'b': 0x01,
      'c': 0x02,
      'd': 0x03,
      'exit_i': 0x00,
      'exit_r': 0x01,
      'set_i': 0x10,
      'jmp_i': 0x20,
      'jmp_r': 0x21,
      'push_i': 0x30,
      'push_r': 0x31,
      'pop': 0x40,
      'incr': 0x50,
      'read_i': 0x60,
      'nat_i': 0xf0,
    };
  }

  assemble(bytecode) {
    const program = [];
    const instructions = bytecode
      .split('\n')
      .map(l => l.trim())
      .map(l => l.split(';')[0].trim())
      .filter(l => l !== '')
      ;

    for (const instruction of instructions) {
      const parts = instruction
        .split(' ')
        .map(p => p.trim());

      for (const part of parts) {
        program.push(this._mnemonics[part] !== undefined ? this._mnemonics[part] : parseInt(part));
      }
    }

    return Buffer.from(program);
  }
};
