const mnemonics = {
  'exit_i': 0x00,
};

exports.byte = program => Buffer.from(program.trim().split(/\s+/).map(c => mnemonics[c] === undefined ? parseInt(c) : mnemonics[c]));
