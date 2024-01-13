const { code } = require('fedelm');

const Memory = require('./memory');

exports.exec = (instruction, memory) => {
  switch(instruction[0]) {
  case code('exit_i'):
    return { exit: instruction.slice(1)[0] };
  case code('exit'):
    return { exit: Memory.get(memory, instruction.slice(1)[0])[1] };
  case code('set_i'):
    Memory.set(memory, instruction[1], instruction.slice(2));

    return {};
  case code('set'):
    Memory.set(memory, instruction[1], Memory.get(memory, instruction[2]));

    return {};
  case code('incr'): {
    const val = Memory.get(memory, instruction[1]).readUInt16BE();
    const res = Buffer.alloc(2);
    res.writeUInt16BE(val + 1);

    Memory.set(memory, instruction[1], res);

    return {};
  }
  case code('push'): {
    Memory.push(memory, Memory.get(memory, instruction[1]));

    return {};
  }
  case code('pop'): {
    const val = Memory.pop(memory);
    Memory.set(memory, instruction.slice(1)[0], val);

    return {};
  }
  }
};
