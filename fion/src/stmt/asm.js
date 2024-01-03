const expr = require('../expr');

exports.create = (var_, args) => ({
  var: var_.type ? var_ : expr.create(var_),
  expr: args.type ? args : expr.create(args),
});
