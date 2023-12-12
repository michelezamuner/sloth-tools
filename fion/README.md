# Fion

Provides the AST definition for Sloth, and a set of tools for libraries that need to work with this AST definition.

## Values and references

Values represent data, and they are always immutable. A reference is an identifier that refers to a value. There can be multiple identifiers referring to the same value. For example, the value representing the byte zero can be referred to by the identifier `0`, or by the identifier `zero`. Since values are immutable, we don't need to worry that different identifiers might represent different concepts, and thus should point to different instances of the same value, because they could change in the future, because this is not possible.

Thus, there is no such thing as "literal" values as opposed to references to values, in the sense that even the literal `3.14` is actually a reference, as much as `pi`. There is no way to directly write a value, but we can only write references. Of course this means that certain references will be defined natively, for example we don't need to define what the reference `3.14` stands for, but we need to define `pi`.

Literals of composite types, like arrays, maps, etc. might not show up in the AST, because they can be calls to factory functions (possibly natively defined), which might have references to basic types as arguments (like numbers). Whether a composite type is known by the AST, or is only known by the parser is irrelevant, because either sooner or later it will have to be translated to some memory model.
