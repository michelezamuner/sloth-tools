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
      const refAst = ast[main.body.ref];

      return `
        ; _
        pop a
        read_i b #{_+10}
        push_r b
        jmp_r a
        ; ${main.body.ref}
        0x00 ${this._hex(refAst.val)}
      `.split('\n').map(l => l.trim()).join('\n').trim();
    }

    if (ast[main.body.fun.ref]) {
      const mainBytecode = this._fun('_', main);
      const funBytecode = this._fun(main.body.fun.ref, ast[main.body.fun.ref].val);

      return mainBytecode.concat(funBytecode).join('\n');
    }

    const bytecode = this._fun('_', main);

    return bytecode.join('\n');
  }

  _fun(name, ast) {
    let byteCount = 0;
    const bytecode = [`; ${name}`];

    const argMap = {};
    const reversedArgs = JSON.parse(JSON.stringify(ast.args));
    reversedArgs.reverse();
    for (const i in reversedArgs) {
      const reg = String.fromCharCode('a'.charCodeAt(0) + +i);
      if (reversedArgs[i].arg !== '_') {
        bytecode.push(`pop ${reg}`);
        byteCount += 2;
        argMap[reversedArgs[i].arg] = reg;
      }
    }

    if (ast.body.fun.loc === 'local') {
      let returnAddressDelta = byteCount;
      for (const arg of ast.body.args) {
        if (arg.ref && argMap[arg.ref]) {
          returnAddressDelta += 2;
        } else {
          returnAddressDelta += 3;
        }
      }
      bytecode.push(`push_i #{_+${returnAddressDelta + 6}}`);
      byteCount += 3;
    }

    for (const arg of ast.body.args) {
      if (arg.ref && argMap[arg.ref]) {
        bytecode.push(`push_r ${argMap[arg.ref]}`);
        byteCount += 2;
      } else {
        bytecode.push(`push_i 0x00 ${this._hex(arg.val)}`);
        byteCount += 3;
      }
    }

    if (ast.body.fun.loc === 'native') {
      bytecode.push(`nat_i #{${name}+${byteCount + 12}} ${this._hex(ast.body.fun.ref.length)}`);
    } else {
      bytecode.push(`jmp_i #{${ast.body.fun.ref}}`);
    }

    bytecode.push('pop a');
    bytecode.push('pop b');
    bytecode.push('push_r a');
    bytecode.push('jmp_r b');

    if (ast.body.fun.loc === 'native') {
      bytecode.push(ast.body.fun.ref.split('').map(c => c.charCodeAt(0)).map(c => this._hex(c)).join(' '));
    }

    return bytecode;
  }

  _hex(str) {
    return '0x' + ('00' + (+str).toString(16)).slice(-2);
  }
};
