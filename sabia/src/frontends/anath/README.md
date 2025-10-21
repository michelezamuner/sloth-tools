# Anath

Anath is a frontend for the Sabia AST, designed to have a syntax that is as close as possible to the AST itself, in order to be used internally as a testing tool.

```
mod app {
  pub enum T = A, B;
  ref a = T::A;
  pub ref main = (proc: ::core::sys::Process) -> ::core::sys::Exit
    ::core::lang::then(
      ::core::lang::debug((a: T) -> T a),
      ::core::sys::Exit::OK
    )
  ;
}
```
