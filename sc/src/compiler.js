module.exports = class Compiler {
  parse(ast) {
    const dataSegment = [];
    let bytecode = [];

    for (const name in ast) {
      if (name.startsWith('@')) {
        bytecode = bytecode.concat([`; @ ${name.substring(2)}: ${ast[name]}`]);

        continue;
      }

      const def = ast[name];

      if (def.obj !== 'val') continue;

      if (!def.val.body) {
        bytecode = bytecode.concat([`; ${name}`, `0x00 ${this._hex(def.val)}`]);

        continue;
      }

      bytecode = bytecode.concat(this._fun(name, def.val, dataSegment));
    }

    if (dataSegment.length) {
      bytecode = bytecode.concat(['; $'], dataSegment);
    }

    return bytecode.join('\n');
  }

  _fun(name, ast, dataSegment) {
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

    if (ast.body.obj === 'val' && !ast.body.val.obj) {
      bytecode.push('pop a');
      bytecode.push(`push_i 0x00 ${this._hex(ast.body.val)}`);
      bytecode.push('jmp_r a');

      return bytecode;
    }

    if (ast.body.obj === 'ref') {
      bytecode.push('pop a');
      bytecode.push(`read_i b #{${ast.body.ref}}`);
      bytecode.push('push_r b');
      bytecode.push('jmp_r a');

      return bytecode;
    }

    if (ast.body.fun.loc === 'local') {
      let returnAddressDelta = byteCount;
      for (const arg of ast.body.args) {
        if (arg.ref && argMap[arg.ref]) {
          returnAddressDelta += 2;
        } else if (arg.ref) {
          returnAddressDelta += 6;
        } else if (arg.val) {
          returnAddressDelta += 3;
        }
      }
      bytecode.push(`push_i #{${name}+${returnAddressDelta + 6}}`);
      byteCount += 3;
    }

    for (const arg of ast.body.args) {
      if (arg.ref && argMap[arg.ref]) {
        bytecode.push(`push_r ${argMap[arg.ref]}`);
        byteCount += 2;
      } else if (arg.ref) {
        // @todo: mix values, refs, and args
        bytecode.push(`read_i a #{${arg.ref}}`);
        bytecode.push('push_r a');
      } else if (arg.val) {
        bytecode.push(`push_i 0x00 ${this._hex(arg.val)}`);
        byteCount += 3;
      }
    }

    if (ast.body.fun.loc === 'native') {
      bytecode.push(`nat_i #{$} ${this._hex(ast.body.fun.ref.length)}`);
    } else {
      bytecode.push(`jmp_i #{${ast.body.fun.ref}}`);
    }

    bytecode.push('pop a');
    bytecode.push('pop b');
    bytecode.push('push_r a');
    bytecode.push('jmp_r b');

    if (ast.body.fun.loc === 'native') {
      dataSegment.push(ast.body.fun.ref.split('').map(c => c.charCodeAt(0)).map(c => this._hex(c)).join(' '));
    }

    return bytecode;
  }

  _hex(str) {
    return '0x' + ('00' + (+str).toString(16)).slice(-2);
  }
};
