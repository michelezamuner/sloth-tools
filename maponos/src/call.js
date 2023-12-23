const { parse } = require('fedelm');

exports.compile = ({ fun: { ref: fun }, args: args }, compile) => {
  switch (fun) {
  case 'INCR': return Buffer.concat([compile(args[0]), parse('incr a')]);
  }
};
