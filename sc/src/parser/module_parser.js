module.exports = class ModuleParser {
  constructor(innerParser) {
    this._innerParser = innerParser;
  }

  parse(lexemes) {
    const blocks = [];
    const block = [];

    for (const i in lexemes) {
      if (block.length && this._isStartOfBlock(lexemes, i)) {
        blocks.push(JSON.parse(JSON.stringify(block)));
        block.length = 0;
      }
      block.push(lexemes[i]);
    }
    blocks.push(block);

    const ast = {};

    let currentTypeApplication = null;
    for (const block of blocks) {
      if (block[1] === ':=') {
        ast[block[0]] = this._innerParser.parse(block.slice(2));
        if (currentTypeApplication) {
          ast[block[0]].type = currentTypeApplication.slice(1).join(' ');
          currentTypeApplication = null;
        }
      }
      if (block[0] === '@') {
        if (block[2] === ':=') {
          ast[`@ ${block[1]}`] = block.slice(3).join(' ');
        } else {
          currentTypeApplication = block;
        }
      }
    }

    return ast;
  }

  _isStartOfBlock(lexemes, i) {
    if (lexemes[i] === '@') {
      return true;
    }

    if (lexemes[+i-1] !== '@' && lexemes[+i+1] === ':=') {
      return true;
    }
  }
};
