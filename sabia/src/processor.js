const process = (runtime, ast, index, mod) => {
  if (ast.elem === 'exp' && ast.var === 'enum') {
    return ast;
  }

  if (ast.elem === 'exp' && ast.var === 'eval') {
    const funId = ast.fun.id.startsWith('::')
      ? ast.fun.id
      : `${mod}::${ast.fun.id}`;
    const parts = index[funId].ast.body.id.split('::');
    if (parts[1] === 'core') {
      const lib = require(`./${parts[1]}/${parts[2]}`);
      const fun = lib[parts[3]];
      const args = ast.args.map(ast => process(runtime, ast, index, mod));

      return (fun)(runtime, args);
    }
  }

  if (ast.elem === 'mod') {
    const main = ast.body.find(ast => ast.id === 'main');
    const status = process(runtime, main.body.body, index, ast.id);

    if (status.type.id === 'Exit' && status.body.id === 'OK') {
      return 0;
    }
  }
};

exports.process = process;
