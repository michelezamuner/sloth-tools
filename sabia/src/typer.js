const typeElem = (ast, statCtx = {}, dynCtx = {}) => {
  if (ast.elem === 'def' && ast.var === 'ref') {
    ast.body = typeElem(ast.body, statCtx, dynCtx);
    ast.type = ast.body.type;
  }
  if (ast.elem === 'exp' && ast.var === 'eval') {
    ast.args = ast.args.map(arg => typeElem(arg, statCtx, dynCtx));
    ast.fun = typeElem(ast.fun, statCtx, dynCtx);
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
    const type = { elem: 'type', var: 'fun', args: [] };
    for (let i in ast.args) {
      type.args[i] = ast.args[i].type;
    }
    ast.body = typeElem(ast.body, statCtx, { ...dynCtx, ...ast.ctx });
    type.ret = ast.body.type;

    ast.type = type;
  }
  if (ast.elem === 'exp' && ast.var === 'id' ) {
    if (dynCtx[ast.id]) {
      ast.type = dynCtx[ast.id].type;
    } else if (statCtx[ast.id]) {
      ast.type = statCtx[ast.id].type;
    } else {
      const parts = ast.id.split('::');
      if (parts[1] === 'core') {
        const lib = require(`./core/${parts[2]}.types`);
        const type = lib[parts[3]];
        ast.type = type;
      }
    }
  }

  return ast;
};

const type = index => {
  for (let i in index) {
    index[i] = typeElem(index[i], index);
  }

  return index;
};

exports.type = type;
