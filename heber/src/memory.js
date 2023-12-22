exports.create = size => ({
  registers: [
    Buffer.alloc(registerSize), // 'a'
    Buffer.alloc(registerSize), // 'b'
    Buffer.alloc(registerSize), // 'c'
    Buffer.alloc(registerSize), // 'd'
  ],
  static: Buffer.alloc(size)
});
exports.load = (memory, code) => code.copy(memory.static, 0);
exports.read = (memory, addr, size = 1) => read(memory.static, addr.readUInt16BE(), size);
exports.get = (memory, addr) => read(memory.registers[addr], 0, registerSize);
exports.set = (memory, addr, val) => val.copy(memory.registers[addr]);

const registerSize = 2;

/**
  * @function
  *
  * Get a deep copy of data to be read, in order to
  * avoid sharing references to the underlying Buffer
  *
  * @arg {int} addr Memory address to copy from
  * @arg {int} size Size of data to copy
  * @return {Buffer}
  */
function read(memory, addr, size) {
  return Buffer.from(memory.buffer.slice(addr, addr + size));
}
