module.exports = class ExprParser {
  parse(lexemes) {
    if (lexemes.length === 1) {
      if (lexemes[0].obj) {
        return lexemes[0];
      }

      return isNaN(lexemes[0])
        ? { obj: 'ref', id: lexemes[0] }
        : { obj: 'val', val: lexemes[0] }
      ;
    }

    if (lexemes.includes('->')) {
      const ast = { obj: 'val', val: { args: [] } };

      let isArgs = true;
      const bodyLexemes = [];
      for (const lexeme of lexemes) {
        if (lexeme === '->') {
          isArgs = false;

          continue;
        }

        if (isArgs) {
          ast.val.args.push(this.parse([lexeme]));
        } else {
          bodyLexemes.push(lexeme);
        }
      }
      ast.val.body = this.parse(bodyLexemes);

      return ast;
    }

    return {
      obj: 'expr',
      fun: this.parse(lexemes.slice(0, 1)),
      args: lexemes.slice(1).map(l => this.parse([l])),
    };
  }
};
