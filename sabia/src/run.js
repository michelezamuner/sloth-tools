const Lexer = require('./lexer');
const Parser = require('./parser/group');
const Normalizer = require('./normalizer');
const Indexer = require('./indexer');
const Typer = require('./typer');
const Processor = require('./processor');

exports.run = process => {
  if (process.argv[2] === '--inline') {
    const code = process.argv[3];
    const lexemes = Lexer.parse(code);
    const ast = Normalizer.normalize(Parser.parse(lexemes));
    const index = Typer.type(Indexer.index(ast));

    return Processor.process({ process }, index, '::_::main');
  }

  return 0;
};
