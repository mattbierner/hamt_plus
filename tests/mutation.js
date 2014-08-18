var hamt = require('../dist_node/hamt');

var containsAll = function(test, arr, keys) {
    keys.forEach(function(k) {
        test.ok(arr.indexOf(k) >= 0, k);
    });
};



exports.simple_keys= function(test) {
    var h1 = hamt.mutate(function(m) {
        hamt.set('a', 3, m);
        hamt.set('b', 5, m);
    }, hamt.make());
    
    containsAll(test,
        hamt.values(h1),
        [5, 3]);

    test.done();
};

exports.does_not_effect_pre_value = function(test) {
    var h = hamt.set('a', 100, hamt.make());
    
    var h1 = hamt.mutate(function(m) {
        hamt.set('a', 3, m);
        hamt.set('b', 5, m);
    }, h);
    
    test.equal(hamt.get('a', h), 100);
    test.equal(hamt.get('a', h1), 3);

    test.equal(hamt.get('b', h), null);
    test.equal(hamt.get('b', h1), 5);
    
    test.done();
};

exports.does_not_effect_post_value = function(test) {    
    var h = hamt.mutate(function(m) {
        hamt.set('a', 3, m);
        hamt.set('b', 5, m);
    }, hamt.make());
    
    var h1 = hamt.set('a', 100, h);

    
    test.equal(hamt.get('a', h), 3);
    test.equal(hamt.get('a', h1), 100);

    test.equal(hamt.get('b', h), 5);
    test.equal(hamt.get('b', h1), 5);
    
    test.done();
};

exports.many = function(test) {
    var insert = ["n", "U", "p", "^", "h", "w", "W", "x", "S", "f", "H", "m", "g",
               "l", "b", "_", "V", "Z", "G", "o", "F", "Q", "a", "k", "j", "r",
               "B", "A", "y", "\\", "R", "D", "i", "c", "]", "C", "[", "e", "s",
               "t", "J", "E", "q", "v", "M", "T", "N", "L", "K", "Y", "d", "P",
               "u", "I", "O", "`", "X"];
    
    var h = hamt.make();
    insert.forEach(function(x) {
        h = hamt.set(x, x, h);
    });
    
    containsAll(test,
        hamt.values(h),
        insert);
    
    test.done();
};
