const process = (runtime, index) => {
  const status = exec(runtime, index['app::main'].body.body, index);
  if (status.type.name === 'std::sys::Exit' && status.name === 'Ok') {
    return 0;
  }
};

exports.process = process;

function exec(runtime, ast, index) {
  if (ast.elem === 'exp' && ast.var === 'cons') {
    return ast;
  }

  if (ast.elem === 'exp' && ast.var === 'ref') {
    return index[ast.name].body;
  }

  if (ast.elem === 'exp' && ast.var === 'eval') {
    const arg = exec(runtime, ast.arg, index);

    let fun = null;
    if (ast.fun.var === 'cons') {
      return ast;
    }

    const funAst = ast.fun.var === 'ref' ? ast.fun : exec(runtime, ast.fun, index);
    if (typeof funAst === 'function') {
      fun = funAst;
    } else {
      const funName = index[funAst.name] ? index[funAst.name].body.name : funAst.name;
      const parts = funName.split('::');
      const lib = require(`./${parts[0]}/${parts[1]}`);
      fun = lib[parts[2]];
    }

    return (fun)(runtime, arg);
  }
}
