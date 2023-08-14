module.exports = class Compiler {
  parse(ast) {
    const exitStatus = ('00' + (+ast.val.body.id).toString(16)).slice(-2);

    return `exit_i 0x${exitStatus}`;
  }
};
