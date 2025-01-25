const Lexer = require('../src/lexer');
const Parser = require('../src/parser');

exports.normalize = ast => {
  if (ast.elem === 'seq') {
    const mainElemId = ast.body.findIndex(ast => ast.elem !== 'def');
    if (mainElemId !== -1) {
      const mainElem = ast.body[mainElemId];
      ast.body.splice(mainElemId);
      ast.body = [...ast.body, ...Parser.parse(Lexer.parse(`
        proc: .core.sys.process
        exit: .core.sys.exit
        dbg: .core.lang.debug
        main: proc -> exit = _ -> dbg _
      `)).body];
      ast.body[ast.body.length - 1].body.args[0] = mainElem;
    }
  }

  return ast;
};
