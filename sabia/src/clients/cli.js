const Compiler = require('../compiler');
const Processor = require('../processor');

exports.exec = process => {
  if (process.argv[2] === '--inline') {
    const code = process.argv[3];
    const frontend = process.env.SLOTH_LANG || 'anath';
    const Frontend = require(`../frontends/${frontend}/frontend`);
    const ast = Frontend.parse(code);

    const index = Compiler.compile(ast);

    return Processor.process({ process }, index);
  }
};
