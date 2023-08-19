module.exports = class ModuleParser {
  constructor(innerParser) {
    this._innerParser = innerParser;
  }

  parse(lexemes) {
    const ast = {};

    let currentDef = null;
    const valLexemes = [];
    for (const i in lexemes) {
      const lexeme = lexemes[i];

      if (lexeme === ':') {
        continue;
      }

      if (lexemes[+i+1] === ':') {
        if (valLexemes.length) {
          ast[currentDef] = this._innerParser.parse(valLexemes);
        }
        currentDef = lexeme;
        valLexemes.length = 0;

        continue;
      }

      valLexemes.push(lexeme);
    }
    ast[currentDef] = this._innerParser.parse(valLexemes);

    return ast;
  }
};
