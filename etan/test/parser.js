const { ast } = require('fion');

exports.parse = code => ast.create({ 'main': { 'RET': [ 'REF', code.replace('exit ', '') ] } });
