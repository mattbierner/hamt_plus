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


exports.mutations_do_not_effect_one_another = function(test) {
    var h = hamt.set('a', 100, hamt.make());
    
    var h1 = hamt.mutate(function(m) {
        hamt.set('a', 3, m);
        hamt.set('b', 5, m);
    }, h);
    
    var h2 = hamt.mutate(function(m) {
        hamt.set('a', 30, m);
        hamt.set('b', 50, m);
    }, h1);
    
    test.equal(hamt.get('a', h), 100);
    test.equal(hamt.get('a', h1), 3);
    test.equal(hamt.get('a', h2), 30);

    test.equal(hamt.get('b', h), null);
    test.equal(hamt.get('b', h1), 5);
    test.equal(hamt.get('b', h2), 50);

    test.done();
};

exports.many = function(test) {
    var insert = [
        "The", "Time", "Traveller", "for", "so", "it", "will", "be",
        "convenient", "to", "speak", "of", "him", "was", "expounding",
        "a", "recondite", "matter", "to", "us", "His", "grey", "eyes",
        "shone", "and", "twinkled", "and", "his", "usually", "pale",
        "face", "was", "flushed", "and", "animated"];
    
    var h = hamt.mutate(function(h) {
        insert.forEach(function(x) {
            hamt.set(x, x, h);
        });
    }, hamt.make());
    
    containsAll(test,
        hamt.values(h),
        insert);
    
    test.done();
};
