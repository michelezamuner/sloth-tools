module.exports = class Assembler {
  constructor() {
    this._mnemonics = {
      'exit_i': 0x00,
    };
  }

  assemble(bytecode) {
    const program = [];
    const instructions = bytecode
      .split('\n')
      .map(l => l.trim())
      .filter(l => l !== '');

    for (const instruction of instructions) {
      const parts = instruction
        .split(' ')
        .map(p => p.trim());

      for (const part of parts) {
        program.push(this._mnemonics[part] || parseInt(part));
      }
    }

    return Buffer.from(program);
  }
};
