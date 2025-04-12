# Sabia

High-level language experiment for a top-down design strategy.

## Language

### Types

Enum type definition:

```
<type> = @<cons> | ...
```
```
T = @A | @B | @C
```

Record type definition:

```
<type> = { <field>: <type>, ... }
```
```
T = { a: TA, b: TB }
```

Function type definition:

```
<type> = <type> ... -> <type>
```
```
T = A B -> C
```

### Scalar expressions

Enum value expression:

```
<cons>
```
```
@A
```

Record value expression:

```
{ <field>: <exp>, ... }
```
```
{ a: @A, b: @B }
```

### Declarations

Identifier declaration:

```
<id>: <type> = <exp>
```
```
a: A = @A
```

### Compound expressions

Block expression:

```
<dec>
...
<exp>
```
```
a: A = @A
a
```

Function value expression (function definition):

```
<pat> ... -> <exp>
```
```
a b -> c
```

Evaluation expression:

```
<exp> <exp> ...
```
```
f a b
```

### Modules

Module definition:

```
.mod.name =
  a: A = .ext.mod.def

  # identifiers starting with "." are exported
  .A = @A | @B

  # identifiers not starting with "." are not exported
  a: A = a -> b
```
