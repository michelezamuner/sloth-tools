const expr = require('../expr');

exports.create = (var_, args) => ({
  var: var_,
  expr: args.type ? args : expr.create(args),
});
