const Lexer = require('./src/lexer');
const ModuleParser = require('./src/module_parser');
const GroupParser = require('./src/group_parser');
const ExprParser = require('./src/expr_parser');

module.exports = class Parser {
  constructor() {
    this._lexer = new Lexer();
    this._parser = new ModuleParser(new GroupParser(new ExprParser()));
  }

  parse(program) {
    return this._parser.parse(this._lexer.parse(program));
  }
};
