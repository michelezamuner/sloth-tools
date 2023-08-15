module.exports = class Parser {
  parse(lexemes) {
    if (lexemes.length === 1) {
      return isNaN(lexemes[0])
        ? { obj: 'ref', id: lexemes[0] }
        : { obj: 'val', val: lexemes[0] }
      ;
    }

    if (lexemes.includes(':')) {
      const ast = { obj: 'def' };

      let isRef = true;
      const valLexemes = [];
      for (const lexeme of lexemes) {
        if (lexeme === ':') {
          isRef = false;

          continue;
        }

        if (isRef) {
          ast.id = lexeme;
        } else {
          valLexemes.push(lexeme);
        }
      }
      ast.val = this.parse(valLexemes);

      return ast;
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
