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

```
$ npm install hamt
```

```
var hamt = require('hamt');

var h = hamt.make();

h = hamt.set('key', 'value', h);

...
```


### Amd
Amd source is in `dist/hamt.js`

```
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

```
var hamt = require('hamt_plus');

// empty table
var h = hamt.make();

// Set 'key' to 'value'
h = hamt.set('key', 'value', h);

// get 'key'
hamt.get('key', h); // 'value'


// The data structure is persistent so the original is not modified.
var h1 = hamt.set('a', 'x', hamt.make());
var h2 = hamt.set('b', 'y', h1);

hamt.get('a', h1); // 'x'
hamt.get('b', h1); // null
hamt.get('a', h2); // 'x'
hamt.get('b', h2); // 'y'


// modify an entry
h2 = hamt.modify('b', function(x) { return x + 'z'; }, h2);
hamt.get('b', h2); // 'yz'

// remove an entry
h2 = hamt.remove('b', h2);
hamt.get('a', h2); // 'x'
hamt.get('b', h2); // null


// Aggregate Info
var h = hamt.set('b', 'y', hamt.set('a', 'x', hamt.make()));

hamt.count(h); // 2
hamt.keys(h); // ['b', 'a'];
hamt.values(h); // ['y', 'x'];
hamt.pairs(h); // [['b', 'y'], ['a', 'x']];

// Fold
var h = hamt.set('a', 10, hamt.set('b', 4, hamt.set('c', -2, hamt.make())));

hamt.fold(\p {value} -> p + value, h); // 12
```


[hamt]: https://github.com/mattbierner/hamt
[hashtrie]: https://github.com/mattbierner/hashtrie
[benchmarks]: http://github.com/mattbierner/js-hashtrie-benchmark
[pdata]: https://github.com/exclipy/pdata
[hash-array-mapped-trie]: http://en.wikipedia.org/wiki/Hash_array_mapped_trie
[persistent]: http://en.wikipedia.org/wiki/Persistent_data_structure

[mori]: https://github.com/swannodette/mori
[persistent-hash-trie]: https://github.com/hughfdjackson/persistent-hash-trie