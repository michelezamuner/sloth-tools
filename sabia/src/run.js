const Lexer = require('./lexer');
const Parser = require('./parser');
const Normalizer = require('./normalizer');
const Indexer = require('./indexer');
const Typer = require('./typer');
const Processor = require('./processor');

exports.run = process => {
  if (process.argv[2] === '--inline') {
    const code = process.argv[3];
    const lexemes = Lexer.parse(code);
    const rawAst = Parser.parse(lexemes);
    const untypedAst = Normalizer.normalize(rawAst);
    const index = Indexer.index(untypedAst);
    const ast = Typer.type(untypedAst, index);
    Processor.process({ process }, ast, index);
  }

  return 0;
};
