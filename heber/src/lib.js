const { instruction } = require('fedelm');

const Memory = require('./memory');
const Executor = require('./executor');


exports.run = (code, config) => {
  const memory = Memory.create(config.memory);
  Memory.load(memory, code);

  let ip = 0;
  const ipBytes = Buffer.alloc(2);
  for (;;) {
    const opcode = Memory.read(memory, ipBytes)[0];
    const instructionLength = 1 + instruction(opcode).operands.length;
    const instr = Memory.read(memory, ipBytes, instructionLength);
    const result = Executor.exec(instr, memory);
    ip += instructionLength;
    ipBytes.writeUInt16BE(ip);

    if (result.exit !== undefined) {
      return result.exit;
    }
  }
};
