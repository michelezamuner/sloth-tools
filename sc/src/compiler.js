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

    if (main.body.obj === 'ref') {
      const refAst = ast[main.body.id];

      return `
        ; _
        pop a
        read_i b #{_+10}
        push_r b
        jmp_r a
        ; ${main.body.id}
        0x00 ${this._hex(refAst.val)}
      `.split('\n').map(l => l.trim()).join('\n').trim();
    }

    if (ast[main.body.fun.id]) {
      const refAst = ast[main.body.fun.id].val;

      const bytecode = ['; _'];
      bytecode.push(`push_i #{_+${main.body.args.length * 3 + 6}}`);
      for (const arg of main.body.args) {
        bytecode.push(`push_i 0x00 ${this._hex(arg.val)}`);
      }
      bytecode.push(`jmp_i #{${main.body.fun.id}}`);
      bytecode.push('pop a');
      bytecode.push('pop b');
      bytecode.push('push_r a');
      bytecode.push('jmp_r b');

      bytecode.push(`; ${main.body.fun.id}`);
      const argMap = {};
      const reversedArgs = JSON.parse(JSON.stringify(refAst.args));
      reversedArgs.reverse();
      for (const i in reversedArgs) {
        const reg = String.fromCharCode('a'.charCodeAt(0) + +i);
        bytecode.push(`pop ${reg}`);
        argMap[reversedArgs[i].id] = reg;
      }
      for (const arg of refAst.body.args) {
        bytecode.push(`push_r ${argMap[arg.id]}`);
      }
      bytecode.push(`nat_i #{${main.body.fun.id}+${refAst.body.args.length * 4 + 12}} ${this._hex(refAst.body.fun.id.length)}`);
      bytecode.push('pop a');
      bytecode.push('pop b');
      bytecode.push('push_r a');
      bytecode.push('jmp_r b');
      bytecode.push(refAst.body.fun.id.split(''.map(c => c.charCodeAt(0)).map(c => this._hex(c)).join(' ')));

      return bytecode.join('\n');
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
