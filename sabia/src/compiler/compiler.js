const Parser = require('./parser');
// const Indexer = require('./indexer');
// const Typer = require('./typer');

exports.compile = lexemes => {
  const ast = Parser.parse(lexemes);
  // const index = Indexer.parse(ast);

  // return Typer.parse(index);
};
