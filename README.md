# Sloth tools

The set of tools needed to execute a high-level language are the following:

- parser: converts code written in a specific high-level language into an AST of a specific type
- compiler: converts an AST of a specific type into bytecode of a specific type
- interpreter: executes bytecode of a specific type
- CLI: combines together all the previous tools into an easy-to-use application

The various tools that are related to the execution of a program talk to each other in different, often complex, ways, that make each tool difficult to be comprehensively tested in isolation.

For example, a compiler converts an AST into a set of bytecode instructions, but if we write tests asserting that a certain AST is converted to certain instructions, how can we be sure that those instructions really perform the processing that we expect? In other words, it's really hard to write a reliable test when the expected result is something as complicated as bytecode.

The same can be said for the parser, converting a high-level language into an AST, where we need to be sure, when we write the test, that the AST we are expecting to receive correctly represents the intent of the code we parsed.

In order to allow full e2e tests, then, we're going to design a simple high-level language, with its own parser, that will carry all e2e tests for all the features provided by a set of parser, compiler and interpreter.

We can then think of running the same tests with a different selection of compiler and interpreter, in order to test them too. This means that we'll already have a battery of tests available when we'll decide to write new compilers and interpreters.

- `cormac`: the high-level language used for testing all the tools, targeting the `fion` AST
- `etan`: the CLI library providing various ways to execute code
- `fedelm`: a bytecode definition
- `fion`: an AST definition
- `heber`: the virtual machine interpreter for the `fedelm` bytecode
- `maponos`: a compiler for the `fion` AST to the `fedelm` bytecode
