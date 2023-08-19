module.exports = class Compiler {
  parse(ast) {
    const main = ast['_'].val;
    if (main.body.obj === 'val') {
      return `
        ; _
        pop a
        push_i 0x00 ${this._hex(main.body.val)}
        jmp_r a
      `.split('\n').map(l => l.trim()).join('\n').trim();
    }

    const bytecode = ['; _', 'pop b'];
    for (const arg of main.body.args) {
      bytecode.push(`push_i 0x00 ${this._hex(arg.val)}`);
    }

    bytecode.push(`nat_i #{_+${main.body.args.length * 3 + 8}} ${this._hex(main.body.fun.id.length)}`);
    bytecode.push('jmp_r b');
    bytecode.push(main.body.fun.id.split('').map(c => c.charCodeAt(0)).map(c => this._hex(c)).join(' '));

    return bytecode.join('\n');
  }

  _hex(str) {
    return '0x' + ('00' + (+str).toString(16)).slice(-2);
  }
};
