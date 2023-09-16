module.exports = class ModuleParser {
  constructor(innerParser) {
    this._innerParser = innerParser;
  }

  parse(lexemes) {
    const blocks = [];
    const block = [];
    const aliases = {};

    let isAlias = false;
    let isTypeApplication = false;
    for (const i in lexemes) {
      if (lexemes[+i+1] === '::') {
        aliases[lexemes[i]] = lexemes[+i+2];
        isAlias = true;
      }

      if (lexemes[+i+1] === ':') {
        isTypeApplication = true;
      }

      if (block.length && isAlias) {
        blocks.push(JSON.parse(JSON.stringify(block)));
        block.length = 0;
      }
      if (block.length && (lexemes[+i+1] === ':' || (!isTypeApplication && lexemes[+i+1] === ':='))) {
        blocks.push(JSON.parse(JSON.stringify(block)));
        block.length = 0;
      }
      if (!isAlias) {
        block.push(lexemes[i]);
      }

      if (isAlias && lexemes[+i-1] === '::') {
        isAlias = false;
      }
      if (isTypeApplication && lexemes[+i+1] === ':=') {
        isTypeApplication = false;
      }
    }
    blocks.push(block);

    const ast = {};

    for (const block of blocks) {
      if (block[0] !== '_' && block[0][0] === block[0][0].toUpperCase()) {
        ast[block[0]] = block[2];

        continue;
      }

      if (block[1] === ':=') {
        ast[block[0]] = this._parseInner(block.slice(2), aliases);
      }

      if (block[1] === ':') {
        const innerAstStart = block.indexOf(':=') + 1;
        const innerAst = this._parseInner(block.slice(innerAstStart), aliases);
        innerAst.type = block.slice(2, innerAstStart - 1).join(' ');

        ast[block[0]] = innerAst;
      }
    }

    return ast;
  }

  _parseInner(ast, aliases) {
    for (const i in ast) {
      if (ast[i] in aliases) {
        ast[i] = aliases[ast[i]];
      }
    }

    return this._innerParser.parse(ast);
  }
};
