# Sloth compiler

Components:

- client: exec
- lexer: parses the Sloth source code into lexemes
- parser: parses lexemes into an AST
- resolver: resolves native and external references in an AST
- checker: type checks an AST
- compiler: compiles and AST into bytecode
- linker: links a module's bytecode with external ones
