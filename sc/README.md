# Sloth compiler

Components:

- client: exec
- lexer: parses the Sloth source code into lexemes
- parser: parses lexemes into an AST
- resolver: resolves native and external references in an AST
- checker: type checks an AST
- compiler: compiles and AST into bytecode
- linker: links a module's bytecode with external ones

## Workings

A program is a single function that takes the command line arguments as input, and returns its exit status as an 8-bit integer.

```sloth
_ _ -> 0
```

The types of the main function can always be inferred, since they're enforced by the language definition.
