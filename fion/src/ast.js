const Fun = require('./fun');

exports.create = funs => {
  if (!Array.isArray(funs)) {
    throw `Invalid ast: must be a list of functions, found '${JSON.stringify(funs)}'`;
  }

  return { funs: funs.map(([f, d]) => Fun.create([f, d])) };
};
