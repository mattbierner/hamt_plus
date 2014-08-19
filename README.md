# HAMT+
Fork of [HAMT][hamt] with transactions and custom key types.

### Overview
This library is a fork of the [HAMT][hamt] [hash array mapped trie][hash-array-mapped-trie] library
that adds a few important features in exchange for slightly degraded performance:

* A transaction interface for mutating a map in a specific context. This allows
  efficent mass operations, while retaining the safety of a persistent data
  structure.

* Custom key compare function.

* Custom hash function.

The APIs of HAMT and HAMT+ are nearly identical, the major difference being
how empty maps are created and the lack of `getHash` type operations in HAMT+,
which instead can use a user defined hash operation.

## Install

### Node
Node source is in `dist_node/hamt.js`

``` javascript
$ npm install hamt_plus
```

``` javascript
var hamt = require('hamt_plus');

var h = hamt.make();

h = hamt.set('key', 'value', h);

...
```


### Amd
Amd source is in `dist/hamt.js`

``` javascript
requirejs.config({
    paths: {
        'hamt': 'dist/hamt'
    }
});

require([
    'hamt'],
function(hamt) {
    ...
});
```


## Usage

``` javascript
var hamt = require('hamt_plus');

// Empty map
var h = hamt.make();

// Set 'key' to 'value'
h = hamt.set('key', 'value', h);

// Get 'key'
hamt.get('key', h); // 'value'


// The data structure is persistent so the original is not modified.
var h1 = hamt.set('a', 'x', hamt.make());
var h2 = hamt.set('b', 'y', h1);

hamt.get('a', h1); // 'x'
hamt.get('b', h1); // null
hamt.get('a', h2); // 'x'
hamt.get('b', h2); // 'y'

// Modify an entry
h2 = hamt.modify('b', function(x) { return x + 'z'; }, h2);
hamt.get('b', h2); // 'yz'

// Remove an entry
h2 = hamt.remove('b', h2);
hamt.get('a', h2); // 'x'
hamt.get('b', h2); // null

/* Aggregation ---------------------------------------------------------------*/
var h = hamt.set('b', 'y', hamt.set('a', 'x', hamt.make()));

hamt.count(h); // 2
hamt.keys(h); // ['b', 'a'];
hamt.values(h); // ['y', 'x'];
hamt.pairs(h); // [['b', 'y'], ['a', 'x']];

// Fold
var h = hamt.set('a', 10, hamt.set('b', 4, hamt.set('c', -2, hamt.make())));

hamt.fold(\p {value} -> p + value, h); // 12

/* Customization -------------------------------------------------------------*/
// Use a custom hash function or key compare function
var h = hamt.make({
    hash: function(key) {
        return hamt.hash(key.x + " " + key.y);
    },
    keyEq: function(key1, key2) {
        return key1.x === key2.x && key1.y === key2.y;
    }});

h = hamt.set(new Vec2(1, 2), 'abc', h);
h = hamt.set(new Vec2(3, 4), 'efg', h);

hamt.get(new Vec2(3, 4), h); // 'efg'
hamt.get(new Vec2(1, 2), h); // 'abc'

/* Mutation ------------------------------------------------------------------*/
var keys = [...];
var h = hamt.mutate(function(h) {
    // Operations inside this block may mutate `h` to improve performance
    // but mutation may not leak out of this block.
    keys.forEach(function(key, i) {
        hamt.set(key, i, h);
    });
}, hamt.make());
```


[hamt]: https://github.com/mattbierner/hamt
[benchmarks]: http://github.com/mattbierner/js-hashtrie-benchmark
[pdata]: https://github.com/exclipy/pdata
[hash-array-mapped-trie]: http://en.wikipedia.org/wiki/Hash_array_mapped_trie
[persistent]: http://en.wikipedia.org/wiki/Persistent_data_structure