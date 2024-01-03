exports.create = size => ({
  registers: [
    Buffer.alloc(registerSize), // 'a'
    Buffer.alloc(registerSize), // 'b'
    Buffer.alloc(registerSize), // 'c'
    Buffer.alloc(registerSize), // 'd'
  ],
  stackPtr: size,
  data: Buffer.alloc(size)
});
exports.load = (memory, code) => code.copy(memory.data, 0);
exports.read = (memory, addr, size = 1) => read(memory.data, addr.readUInt16BE(), size);
exports.get = (memory, addr) => read(memory.registers[addr], 0, registerSize);
exports.set = (memory, addr, val) => val.copy(memory.registers[addr]);
exports.push = (memory, val) => {
  const newStackPtr = memory.stackPtr - registerSize;
  val.copy(memory.data, newStackPtr);
  memory.stackPtr = newStackPtr;
};
exports.pop = memory => {
  const stackPtr = memory.stackPtr;
  memory.stackPtr += registerSize;

  return read(memory.data, stackPtr, registerSize);
};

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
