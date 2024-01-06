const { run } = require('./run');

exports.exec = (code, parse, config) => run(code, parse, config);
