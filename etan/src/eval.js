const { run } = require('./run');

exports.exec = (code, config) => run(code, config.parse, { memory: config.memory });
