const fs = require('fs');

module.exports = class Client {
  constructor(assembler, loader, vm) {
    this._assembler = assembler;
    this._loader = loader;
    this._vm = vm;
  }

  exec() {
    const bytecodeFile = process.argv[2];
    const bytecode = fs.readFileSync(bytecodeFile, 'utf-8');
    const program = this._assembler.assemble(bytecode);
    this._loader.load(program);

    const exitStatus = this._vm.run();

    process.exit(exitStatus);
  }
};
