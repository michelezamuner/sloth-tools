const exec = (runtime, ast, index) => {
  if (ast.elem === 'exp' && ast.var === 'enum') {
    return ast;
  }

  if (ast.elem === 'exp' && ast.var === 'eval') {
    const parts = index[ast.fun.id].body.id.split('::');
    if (parts[1] === 'core') {
      const lib = require(`./${parts[1]}/${parts[2]}`);
      const fun = lib[parts[3]];
      const args = ast.args.map(ast => exec(runtime, ast, index));
      return (fun)(runtime, args);
    }
  }
};

const process = (runtime, index, main) => {
  const status = exec(runtime, index[main].body.body, index);
  if (status.type.id === '::_::Exit' && status.body.id === 'OK') {
    return 0;
  }
};

exports.process = process;
