# Melqart

Melqart is a frontend for the Sabia language featuring:
- as little special characters and keywords as possible
- scopes defined by indentation as much as possible

```
::_ =
  T = A
  main = _: ::core::sys::Process ->
    ::core::lang::then
      ::core::lang::debug
        T.A
      ::core::sys::Exit.OK
```