const fun = require('./fun');

exports.create = funs => ({ funs: Object.entries(funs).map(([f, d]) => fun.create(f, d)) });
