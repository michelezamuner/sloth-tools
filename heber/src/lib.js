const memory = require('./memory');
const executor = require('./executor');
const { instruction } = require('fedelm');

exports.memory = memory;

exports.run = mem => {
  let ip = 0;
  const ipBytes = Buffer.alloc(2);
  for (;;) {
    const opcode = memory.read(mem, ipBytes)[0];
    const instructionLength = 1 + instruction(opcode).operands.length;
    const instr = memory.read(mem, ipBytes, instructionLength);
    const result = executor.exec(instr, mem);
    ip += instructionLength;
    ipBytes.writeUInt16BE(ip);

    if (result.exit) {
      return result.exit;
    }
  }
};
