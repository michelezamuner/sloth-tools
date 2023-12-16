const expr = require('./expr');

exports.create = e => ({ expr: expr.create(e) });
