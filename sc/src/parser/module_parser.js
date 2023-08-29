module.exports = class ModuleParser {
  constructor(innerParser) {
    this._innerParser = innerParser;
  }

  parse(lexemes) {
    const blocks = [];
    const block = [];

    let isTypeApplication = false;
    for (const i in lexemes) {
      if (lexemes[+i+1] === ':') {
        isTypeApplication = true;
      } else if (isTypeApplication && (lexemes[+i+1] === '::')) {
        isTypeApplication = false;
      }

      if (block.length && (lexemes[+i+1] === '::' || lexemes[+i+1] === ':' || (!isTypeApplication && lexemes[+i+1] === ':='))) {
        blocks.push(JSON.parse(JSON.stringify(block)));
        block.length = 0;
      }
      block.push(lexemes[i]);
    }
    blocks.push(block);

    const ast = {};

    for (const block of blocks) {
      if (block[1] === ':=') {
        ast[block[0]] = this._innerParser.parse(block.slice(2));
      }
      if (block[1] === '::') {
        ast[block[0]] = { obj: 'type', type: block.slice(2).join(' ') };
      }
      if (block[1] === ':') {
        const innerAstStart = block.indexOf(':=') + 1;
        const innerAst = this._innerParser.parse(block.slice(innerAstStart));
        innerAst.type = block.slice(2, innerAstStart - 1).join(' ');

        ast[block[0]] = innerAst;
      }
    }

    return ast;
  }
};
