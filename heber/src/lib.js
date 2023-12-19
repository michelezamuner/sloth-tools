const memory = require('./memory');
const executor = require('./executor');

exports.run = mem => {
  const opcode = memory.read(mem, 0).readUInt8();
  const operands = memory.read(mem, 1);
  const result = executor.exec(opcode, operands);

  return result.exit;
};
