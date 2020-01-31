[![Build Status](https://travis-ci.org/fgnass/deep-match.svg?branch=master)](https://travis-ci.org/fgnass/deep-match)

# Check if two values deeply match

`deepMatch(object, example)`

All properties and nested objects mentioned in the `example` are required to be
present in `object`.

```js
// two objects that look exactly the same
deepMatch({ a: 1, b: 2 } }, { a: 1, b: 2 }); // true

// additional properties on the left-hand side are ignored
deepMatch({ a: 1, b: 2 } }, { a: 1 }); // true

// everything on the right-hand side is required
deepMatch({ a: 1 } }, { a: 1, b: 2 }); // false

// same for arrays
deepMatch([1, 2, 3], [1, 2]); // true
deepMatch([1, 2, 3], [3, 4]); // false
```

Regular expressions and functions in the `example` are run against the corresponding values in the `object`:

```js
deepMatch('aaa', /a+/); // true
deepMatch('bbb', /a+/); // false
deepMatch(['aaa', 'bbb'], [/a+/]); // true
deepMatch(['aaa', 'bbb'], [/a+/, /b+/]); // true
deepMatch(['aaa', 'ccc'], [/a+/, /b+/]); // false
deepMatch([1, 2, 3], [v => v === 1]); // true

```

When matching arrays order of items do not matters by default. To change it you can use additional parameter:

```js
let opts = { arrayOrderMatters: true };
deepMatch([1, 2], [1, 2], opts); // true
deepMatch([1, 2], [2, 1], opts); // false
deepMatch([1, 2], [   2], opts); // false

// disable checks for undefined items
// [,2] is the same as [undefined, 2]
deepMatch([1, 2], [ , 2], opts); // true

// arrayOrderMatters applies also to nested arrays:
source  = { a1: [ {i1: []}, {i2: [1, 2,         [31, 32, 33], 4, 5]} ]};
matcher = { a1: [ {i1: []}, {i2: [1, undefined, [32, 33    ],  , 5]} ]};
deepMatch(source, matcher, opts); // false
deepMatch(source, matcher);       // false

// Note that in case of arrayOrderMatters=false undefined is not skipped
source  = { a1: [ {i1: []}, {i2: [1, 2,         [31, 32,        33], 4, 5]} ]};
matcher = { a1: [ {i1: []}, {i2: [1, undefined, [31, undefined, 33],  , 5]} ]};
deepMatch(source, matcher, opts); // true
deepMatch(source, matcher);       // false

```

## Rules

Values are compared according to the following rules:

* Identical values always match.
* Values of different types never match.
* Values that are no objects only match if they are identical (see above).
* Null values (which are also objects) only match if both are null.
* Arrays match if all items in the example match (note different behavior for option `arrayOrderMatters`).
* When `arrayOrderMatters=true` value of `undefined` matchers are skipped.
* When `arrayOrderMatters=false` (default behavior) value of `undefined` matchers are NOT skipped.
* Objects match if all properties in the example match.

# License

MIT
