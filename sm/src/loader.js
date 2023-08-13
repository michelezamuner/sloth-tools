module.exports = class Loader {
  constructor(memory) {
    this._memory = memory;
  }

  load(program) {
    this._memory.load(program);
  }
};
