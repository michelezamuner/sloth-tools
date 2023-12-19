const { ast } = require('fion');

exports.parse = code => ast.create({ 'main': { 'RET': [ 'REF', code.match(/exit\((.*)\)/)[1] ] } });
