const Lexer = require('../../lexer');
const Parser = require('../../parser/group');

exports.normalize = (ast, main) => {
  const parts = main.split('::');
  const defaultAst = Parser.parse(Lexer.parse(`
    ::${parts[1]} =
      ${parts[2]} = _: ::core::sys::Process -> ::core::lang::then (::core::lang::debug _) ::core::sys::Exit.OK
  `));
  for (const item of ast.body) {
    if (item.elem === 'def') {
      defaultAst.body.push(item);
    } else {
      const mainId = defaultAst.body.findIndex(ast => ast.id === 'main');
      defaultAst.body[mainId].body.body.args[0].args[0] = item;
    }
  }

  return defaultAst;
};
