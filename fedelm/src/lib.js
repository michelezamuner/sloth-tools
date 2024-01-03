const instructions = require('./instructions.json');
const registers = require('./registers.json');

exports.instruction = opcode => instructionsByOpcode[opcode];
exports.code = mnemonic => {
  const instructionCode = codesByInstructionMnemonics[mnemonic];

  return instructionCode !== undefined ? instructionCode : codesByRegisterMnemonics[mnemonic];
};

exports.parse = code => {
  const tokens = code.trim().split(/\s+/).filter(c => c !== '');
  const bytecode = [];

  for (const i in tokens) {
    const token = tokens[i];
    const instructionCode = codesByInstructionMnemonics[token];
    const registerCode = codesByRegisterMnemonics[token];
    if (instructionCode !== undefined) {
      const instruction = instructionsByOpcode[instructionCode];
      for (let j = 1; j <= instruction.operands.length; j++) {
        const next = tokens[+i+j];
        if (!next || codesByInstructionMnemonics[next] !== undefined) {
          throw `Instruction '${token}' expects ${instruction.operands.length} bytes operands`;
        }
        if (instruction.operands[j-1] === 'r' && codesByRegisterMnemonics[next] === undefined) {
          throw `Instruction '${token}' expects operand ${j-1} to be a register`;
        }
        if (instruction.operands[j-1] === 'v' && isNaN(next)) {
          throw `Instruction '${token}' expects operand ${j-1} to be a value`;
        }
      }
      bytecode.push(instructionCode);
    } else if (registerCode !== undefined) {
      bytecode.push(registerCode);
    } else if (!isNaN(token)) {
      bytecode.push(+token);
    } else {
      throw `Invalid instruction '${token}'`;
    }
  }

  return Buffer.from(bytecode);
};

const instructionsByOpcode = Object.fromEntries(instructions.map(({ code, mnemonic, operands }) => [+code, { mnemonic: mnemonic, operands: operands }]));
const codesByInstructionMnemonics = Object.fromEntries(instructions.map(({ code, mnemonic }) => [mnemonic, +code]));
const codesByRegisterMnemonics = Object.fromEntries(registers.map(({ code, mnemonic }) => [mnemonic, +code]));
