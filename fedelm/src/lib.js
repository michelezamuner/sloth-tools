const mnemonics = {
  0x00: 'exit_i',
};

const _m = Object.fromEntries(Object.entries(mnemonics).map(([k, v]) => [v, parseInt(k)]));

exports.mnemonics = opcode => mnemonics[opcode];

exports.parse = code =>
  Buffer.from(
    code
      .trim()
      .split(/\s+/)
      .filter(c => c.length !== 0)
      .map(c => _m[c] === undefined ? parseInt(c) : _m[c])
  );
