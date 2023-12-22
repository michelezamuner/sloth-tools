const expr = require('../expr');

exports.create = args => {
  if (args.type) {
    return { expr: args };
  }

  return { expr: expr.create(args) };
};
