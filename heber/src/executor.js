exports.exec = (opcode, operands) => ({ exit: operands.readUInt8() });
