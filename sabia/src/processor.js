const process = (runtime, ast, index) => {
  if (ast.elem === 'exp' && ast.var === 'eval') {
    const parts = index[ast.fun.id].ast.val.split('.');
    if (parts[0] === 'core') {
      const lib = require(`./${parts[0]}/${parts[1]}`);
      const fun = lib[parts[2]];
      (fun)(runtime, ast.args);
    }
  }

  if (ast.elem === 'seq') {
    const main = ast.body.find(ast => ast.elem === 'def' && ast.id === 'main');
    process(runtime, main.body, index);
  }

  return ast;
};

exports.process = process;
