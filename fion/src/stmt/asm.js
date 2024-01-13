const Expr = require('../expr');

exports.create = (var_, args) => ({
  var: var_.type ? var_ : Expr.create(var_),
  expr: args.type ? args : Expr.create(args),
});
