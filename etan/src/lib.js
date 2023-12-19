const { eval: eval_ } = require('./eval');

exports.exec = (process, parse, config) => {
  const option = process.argv[2];

  switch (option) {
  case '--eval': {
    const status = eval_(process.argv[3], parse, config);
    process.exit(status);
    break;
  }
  default:
    process.stderr.write(`Invalid option '${option}'\n`);
    process.exit(1);
  }
};
