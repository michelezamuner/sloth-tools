# Sloth language Alpha

Frontend for the Sloth compiler, for the Alpha language experiment.

## Syntax

A program is a collection of modules, and each module is a list of definitions. A definition is an assignment of an expression to an identifier, and is written like:

```txt
identifier := expression
```

so that a module looks like:

```txt
id_1 := expr_1
id_2 := expr_2
```

An expression can be evaluated to produce a value.

The most simple kind of expression is a value itself. A value can be expressed literally:

```txt
my_value := 0
```

or it can be a reference to another value that has been assigned to an identifier:

```txt
v := 0
my_value := v
```

Most commonly, expressions are applications of functions to values:

```txt
res := f a b
```

where the first term of the expression is always used as a function, and the other terms as its arguments.

A function is an expression that uses the given arguments:

```txt
f := a b -> g a b
```

In a function literal the list of formal arguments is located before the `->` symbol, and the expression using those arguments is located after.

We can use the `_` symbol to ignore arguments:

```txt
f := a _ -> g a 0
```

A program need a special function, the main function, to be executed at the program start. This function must be called `_`, and takes two arguments:

```txt
_ := _ _ -> 0
```

the evaluation of the expression of the main function is the exit status of the program.
