exports.create = (create, fun, ...args) => {
  return {
    fun: fun.type ? fun : create(fun),
    args: args.map(a => a.type ? a : create(a)),
  };
};
