const Expr = require('../expr');

exports.create = (var_, args) => ({
  var: var_,
  expr: args.type ? args : Expr.create(args),
});
