# Enlil

Enlil is a frontend for the Sabia AST with a Rust-like syntax style.

```
mod app {
  enum T { A }

  const a = T::A;

  fn main(_: core::sys::Process) -> core::sys::Exit {
    dbg!((a: T) -> T {
      a
    });

    core::sys::Exit::OK
  }
}
```
