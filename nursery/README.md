# Lang

A value represents a unit of information. Relations can be defined where two values are related to a third one:

```sloth
rel a of :b is :c
```

here we are stating that the values `:b` and `:c` are related through the relation `a`. In other words, the application of the relation `a` to the value `:b` is evaluated to the value `:c`.

Once we defined a relation, we can explicitly refer to its application:

```sloth
a of :b # evaluated to :c
```

this is the application of `a` to `:b`, which, as we defined, is equivalent to `:c`.

In the previous syntax, the term `a` is a reference to a relation, and not a relation itself, while `:b` directly represents a value. In fact, we could refer directly to a relation without using any reference, by writing an anonymous relation:

```sloth
(rel of :b is :c) of :b # evaluated to :c
```

A relation can be applied to multiple values:

```sloth
rel a of v is match v in
  :b is :c,
  :d is :e
```

here `v` is not another relation, but a reference to an unknown value. In fact, any of the following applications will match the previous definition:

```sloth
a of :b # evaluated to :c
a of :d # evaluated to :e
```

For example, we can define the "not" relation for boolean values like this:

```sloth
rel not of v is match v in
  :false is :true,
  :true is :false
```

In order to define the "and" relation, which works with two arguments, we can split it into two sub-relations first:

```sloth
rel and_false of v is match v in :false is :false, :true is :false
rel and_true of v is match v in :false is :false, :true is :true
```

and then we can refer to these two sub-relations in order to define the real "and" relation:

```sloth
rel and of v is match v in :false is :and_false, :true is :and_true
```

Now we can use `and` like this:

```sloth
(and of :true) of :true # evaluates to :true
```

which can be simplified with the following syntax:

```sloth
and of :true, :true # evaluates to :true
```

We can use anonymous relations in order to avoid defining explicit sub-relations:

```sloth
rel and of v is match v in
  :false is (rel of w is match w in
    :false is :false,
    :true is :false
    )
  :true is (rel of v is match v in
    :false is :false,
    :true is :true
  )
```

For this we can use the following simplified syntax:

```sloth
rel and of v, w is match v, w in
  :false, :false is :false,
  :false, :true is :false,
  :true, :false, is :false,
  :true, :true is :true
```

When we have a list of matching arguments, we can use a single syntax when we want to match any combination of values for those arguments:

```sloth
rel f of a, b is match a, b in
  :u, :u is :x,
  :v, :v is :y,
  :u, :v | :v, :u is :z
```

which means that any of `:u, :v` and `:v, :u` is evaluated to `:z`.

Additionally, we can match to any remaining value with `_` like this:

```sloth
rel f of a, b is match a, b in (
  :u, :u is :x,
  :u, _ is :y,
  _, :v is :z
)
```

which means that only if `a` and `b` are exactly `:u` both, the result will be `:x`, but if `a` is `:u` and `b` is any value, the result is `:y`, while if `b` is `:v` and `a` is any value, the result is `:z`.

We can define addition of 8-bit integers like this:

```sloth
rel add of a, b is match a, b in (
  :0, :0 is :0,
  :0, :1 | :1, :0 is :1,
  :0, :2 | :2, :0 is :2,
  ...
  :0, :255 | :255, :0 is :255,
  :1, :1 is :2,
  :1, :2 | :2, :1 is :3,
  ...
  :1, :254 | :254, :1 is :255,
  :2, :2 is :4,
  :2, :3 | :3, :2 is :5,
  ...
  :2, :253 | :253, :2 is :255,
  ...
  :127, :127 is :254,
  :127, :128 | :128, :127 is :255
)
```

In the same way we can define subtraction `sub`. In order to define multiplication, on the other hand, we can combine the two relations `add` and `sub` we just defined:

```sloth
rel mul of a, b is (rel f of res, i is match i in
  :1 is res,
  _ is f of (add of res, a), (sub of i, :1)
) of a, b
```

which works like this:

- `mul of :3, :5` calls `f of :3, :5`
- which is `f of (add of :3, :3), (sub of :5, :1)`
- which is `f of (add of :6, :3), (sub of :4, :1)`
- which is `f of (add of :9, :3), (sub of :3, :1)`
- which is `f of (add of :12, :3), (sub of :2, :1)`
- which is `:15`

We can use unresolved relations to compound together unknown values:

```sloth
rel r of u, v
```

Unresolved relations are used by applying them to values:

```sloth
r of :0, :1
```

this application cannot be evaluated to any value, and thus it's carried around as it is.

We can match on unresolved applications as well:

```sloth
rel g of a, b
rel f of a is match a in
  :0 is :1,
  g of u, v is v
```

here the application `f of (g of :0, :1)` is evaluated to `:0`. The same way we can match on the relation variable:

```sloth
rel f of (rel a of v) is v
```

where again `f of (rel a of :0)` is evaluated to `:0`.

We can also define unresolved relations of single values, in order to apply a tag to a value:

```sloth
rel r of a
rel s of a
rel f of (r of a) is a
```

this way the relation `f` is only defined for values tagged with the relation `r`.

We can use unresolved relations to define lists:

```sloth
rel cat of h, t
cat of :2, (cat of :1, (cat of :0, :[])) # is the list [:0, :1, :2]
```

We can implement a `head` and `tail` relations for lists:

```sloth
rel head of (cat of h, t) is h
rel tail of (cat of h, t) is t
```
