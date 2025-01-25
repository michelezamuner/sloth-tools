const type = (ast, index, innerIndex = {}) => {
  if (ast.elem === 'seq') {
    for (let i in ast.body) {
      ast.body[i] = type(ast.body[i], index);
    }

    return ast;
  }

  if (ast.elem === 'def' && ast.var === 'ext') {
    const parts = ast.val.split('.');
    if (parts[0] === 'core') {
      const lib = require(`./${parts[0]}/${parts[1]}.types`);
      const type = lib[parts[2]];
      ast.type = { elem: 'type', id: type };
    }
  }

  if (ast.elem === 'exp' && ast.var === 'id') {
    const match = index[ast.id] || innerIndex[ast.id];
    ast.type = { elem: 'type', id: match.ast.type.id };
  }

  if (ast.elem === 'exp' && ast.var === 'eval') {
    const funType = index[ast.fun.id].ast.type.id;
    const matches = funType.match(/^(?<args>.*)->(?<ret>.*)$/);
    const argTypes = matches.groups.args.split(',');
    for (let i in argTypes) {
      let type = argTypes[i];
      if (argTypes[i].startsWith('<')) {
        if (index[ast.args[0].id]) {
          type = index[ast.args[0].id].ast.type.id;
        } else {
          type = innerIndex[ast.args[0].id].ast.type.id;
        }
      }
      ast.args[i].type = { elem: 'type', id: type };
    }
    const retType = matches.groups.ret;
    ast.type = { elem: 'type', id: retType };
    ast.fun.type = { elem: 'type', id: funType };
  }

  if (ast.var === 'fun') {
    const res = ast.type.id.match(/(?<args>.*)->(?<ret>.*)/);
    const args = res.groups.args.split(',');
    for (let i in args) {
      ast.args[i].type = { elem: 'type', id: args[i] };
    }
    ast.body = type(ast.body, index, index[ast.id].index);
    ast.body.type = { elem: 'type', id: res.groups.ret };
  }

  return ast;
};

exports.type = type;
