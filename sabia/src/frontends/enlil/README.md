# Enlil

Enlil is a frontend for the Sabia language that should be as close as possible to the standard lexemes format expected by the compiler. This means that special characters and keywords are used to make it as clear as possible when all the language features are used.

```
mod ::_ {
  enum T { A }

  ref main = fun (_: ::core::sys::Process) {
    ::core::lang::then(
      ::core::lang::debug(T.A),
      ::core::sys::Exit.OK
    )
  }
}
```
