exports.create = (args, create) => {
  if (args.type) {
    return { expr: args };
  }

  return { expr: create(args) };
};
