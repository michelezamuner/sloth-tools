const { parse } = require('fedelm');

exports.compile = ({ val: _val }) => {
  return parse(`set_i a 0x00 ${_val.readUInt8()}`);
};
