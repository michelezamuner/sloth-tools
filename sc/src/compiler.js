module.exports = class Compiler {
  parse(ast) {
    const mainDef = ast.val;
    const main = mainDef.val;

    if (main.body.obj === 'val') {
      return `exit_i ${this._hex(main.body.val)}`;
    }

    let size = 0;
    const bytecode = [];
    for (const arg of main.body.args) {
      bytecode.push(`push_i 0x00 ${this._hex(arg.val)}`);
      size += 3;
    }

    bytecode.push(`nat_i 0x00 ${this._hex(size + 8)} ${this._hex(main.body.fun.id.length)}`);
    bytecode.push('pop a');
    bytecode.push('exit_r a');
    bytecode.push(main.body.fun.id.split('').map(c => c.charCodeAt(0)).map(c => this._hex(c)).join(' '));

    return bytecode.join('\n');
  }

  _hex(str) {
    return '0x' + ('00' + (+str).toString(16)).slice(-2);
  }
};
