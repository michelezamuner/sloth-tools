const { ast } = require('fion');

exports.parse = code => ast.create({ 'main': [['RET', [ 'BYTE', +code.replace('exit ', '') ]]] });
