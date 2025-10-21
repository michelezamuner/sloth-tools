# Melqart

Melqart is a frontend for the Sabia AST featuring:
- as little special characters and keywords as possible
- scopes defined by indentation as much as possible

```
_ =
  T = A
  main = [core.sys.Process -> core.sys.Exit] _ ->
    @dbg [T] A ;

    [core.sys.Exit] OK
```

The version of Melquart without syntactic sugar is something like:

```
_ = {
  T = { A }
  main = [core.sys.Process -> core.sys.Exit ] _ -> {
    core.lang.then(
      @dbg([T] A),
      [core.sys.Exit] OK
    )
  }
}
```
