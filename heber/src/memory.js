exports.create = size => Buffer.alloc(size);
exports.load = (memory, code) => code.copy(memory, 0);
exports.read = (memory, addr) => read(memory, addr, 1);

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
  const result = Buffer.alloc(size);
  memory.copy(result, 0, addr, addr + size);

  return result;
}
