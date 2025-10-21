const Indexer = require('./compiler/indexer');
const Typer = require('./compiler/typer');

exports.compile = ast => {
  const index = Indexer.index(ast);

  return Typer.type(index);
};
