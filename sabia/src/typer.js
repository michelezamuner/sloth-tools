const type = (ast, index, mod = null, innerIndex = {}) => {
  if (ast.elem === 'mod') {
    for (let i in ast.body) {
      ast.body[i] = type(ast.body[i], index, ast.id, innerIndex);
    }
  }

  if (ast.elem === 'exp' && ast.var === 'id') {
    if (innerIndex[ast.id]) {
      ast.type = innerIndex[ast.id].type;
    } else {
      ast.type = index[`${mod}::${ast.id}`].ast.type;
    }
  }

  if (ast.elem === 'exp' && ast.var === 'eval') {
    const funName = ast.fun.id;
    const fun = index[`${mod}::${funName}`].ast;
    ast.fun.type = fun.type;
    for (let i in ast.args) {
      ast.args[i] = type(ast.args[i], index, mod, innerIndex);
    }

    if (ast.fun.type.ret.var === 'gen') {
      const genRet = ast.fun.type.ret.gen;
      let concrete = null;
      for (let i in ast.fun.type.args) {
        if (ast.fun.type.args[i].gen === genRet) {
          concrete = ast.args[i].type;
        }
      }
      ast.type = concrete;
    } else {
      ast.type = ast.fun.type.ret;
    }
  }

  if (ast.elem === 'exp' && ast.var === 'fun') {
    const argsTypes = [];
    for (const arg of ast.args) {
      argsTypes.push(arg.type);
      innerIndex[arg.id] = arg;
    }
    ast.body = type(ast.body, index, mod, innerIndex);
    for (const arg of ast.args) {
      delete innerIndex[arg.id];
    }
    const retType = ast.body.type;
    const funType = {
      elem: 'type',
      var: 'fun',
      args: argsTypes,
      ret: retType,
    };
    ast.type = funType;
  }

  if (ast.elem === 'ext') {
    const parts = ast.id.split('::');
    if (parts[1] === 'core') {
      const lib = require(`./core/${parts[2]}.types`);
      const type = lib[parts[3]];
      ast.type = type;
    }
  }

  if (ast.elem === 'def' && ast.var === 'ref') {
    ast.body = type(ast.body, index, mod, innerIndex);
    ast.type = ast.body.type;
  }

  return ast;
};

exports.type = type;
