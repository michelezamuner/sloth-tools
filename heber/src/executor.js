const { code } = require('fedelm');
const memory = require('./memory');

exports.exec = (instruction, mem) => {
  switch(instruction[0]) {
  case code('exit_i'):
    return { exit: instruction.slice(1)[0] };
  case code('exit'):
    return { exit: memory.get(mem, instruction.slice(1)[0])[1] };
  case code('set_i'):
    memory.set(mem, instruction[1], instruction.slice(2));

    return {};
  case code('incr'): {
    const val = memory.get(mem, instruction[1]).readUInt16BE();
    const res = Buffer.alloc(2);
    res.writeUInt16BE(val + 1);

    memory.set(mem, instruction[1], res);

    return {};
  }
  }
};
