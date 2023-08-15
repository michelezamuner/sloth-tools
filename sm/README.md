# Sloth machine

## Components

- client: eval, repl, exec
- vm: execute instructions

## Bytecode

Since we don't have a high-level language of reference for this virtual machine yet, we cannot make strong decisions about what middle-level constructs the bytecode should provide in order to better support such language.

For this reason, for now we'll stick to a very low-level et of instructions, and maybe in a next version of the virtual machine, after having built a reference language, we'll know how to improve the bytecode in order to simplify compilation.

## Todo

- load compiled libraries at vm boot (like `std``)
- remove assembler and read binary files: the compiler of a language needs to know the virtual memory addresses native functions are linked to
