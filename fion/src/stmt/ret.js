const Expr = require('../expr');

exports.create = args => {
  if (args.type) {
    return { expr: args };
  }

  return { expr: Expr.create(args) };
};
