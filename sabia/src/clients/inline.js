const Lexer = require('../lexer');
const Parser = require('../parser/group');
const Normalizer = require('./inline/normalizer');
const Indexer = require('../indexer');
const Typer = require('../typer');
const Processor = require('../processor');

exports.exec = (code, main) => {
  // @todo: call frontend
  const lexemes = Lexer.parse(code);
  const ast = Normalizer.normalize(Parser.parse(lexemes), main);
  const index = Typer.type(Indexer.index(ast));

  return Processor.process({ process }, index, main);
};
