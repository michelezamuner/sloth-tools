# Sabia

High-level language experiment for a top-down design strategy.

## Language

### Types

Types must be uppercase.

Enum type definition:

```
<type> = <cons> | ...
```
```
T = A | B | C
```

Record type definition:

```
<type> = { <field>: <type>, ... }
```
```
T = { a: TA, b: TB }
```

Function type definition (@TODO: leave this?):

```
<type> = <type> ... -> <type>
```
```
T = A B -> C
```

### Definitions

Reference definition:

```
<ref> = <exp>
```
```
a = T.A
```

### Expressions

Reference expression:

```
<ref>
```
```
a
```

Enum value expression:

```
<type>.<cons>
```
```
T.A
```

Record value expression:

```
{ <field>: <exp>, ... }
```
```
{ a: T.A, b: T.B }
```

Function expression:

```
<pat>:<type> ... -> <exp>
```
```
a: A b: B -> c
```

Evaluation expression:

```
<exp> <exp> ...
```
```
f a b
```

### Modules

Module declaration:

```
::mod::name
  # external definition
  a = ::ext::mod::def

  # identifiers starting with "::" are public
  ::T = A | B

  # identifiers not starting with "::" are private
  f = a: A -> b
```
