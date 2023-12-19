const instructions = {
  0x00: { mnemonic: 'exit_i', operands: 1 },
};

const opcodes = Object.fromEntries(Object.entries(instructions).map(([opcode, description]) => [description.mnemonic, opcode]));

exports.instruction = opcode => instructions[opcode];

exports.parse = code => {
  const chars = code.trim().split(/\s+/).filter(c => c !== '');
  const bytecode = [];

  for (const i in chars) {
    const char = chars[i];
    const opcode = opcodes[char];
    if (opcode !== undefined) {
      const instruction = instructions[opcode];
      for (let j = 1; j <= instruction.operands; j++) {
        const next = chars[parseInt(i)+j];
        if (!next || opcodes[next !== undefined]) {
          throw `Instruction '${char}' expects ${instruction.operands} operands`;
        }
      }
      bytecode.push(opcode);
    } else {
      bytecode.push(parseInt(char));
    }
  }

  return Buffer.from(bytecode);
};
