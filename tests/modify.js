var hamt = require('../dist_node/hamt');


exports.single = function(test) {
    var h = hamt.set('a', 3, hamt.make());
    var h1 = hamt.modify('a', function(x) { return x * 2 }, h);

    test.equal(hamt.get('a', h1), 6);
    
    test.done();
};

exports.non_existant = function(test) {
    var h = hamt.modify('a', function(x) { return 10; }, hamt.make());
    test.equal(hamt.get('a', h), 10);
    
    test.done();
};

exports.collision = function(test) {
    var h = hamt.make({'hash': function() { return 0; }});
    var h1 = hamt.set('a', 3, h);
    var h2 = hamt.set('b', 5, h1);
    
    var h3 = hamt.modify('a', function(x) { return x * 2; }, h2);
    test.equal(hamt.get('a', h3), 6);
    test.equal(hamt.get('b', h3), 5);
    
    var h4 = hamt.modify('b', function(x) { return x * 2; }, h3);
    test.equal(hamt.get('a', h4), 6);
    test.equal(hamt.get('b', h4), 10);
    
    // Non existant
    var h5 = hamt.modify('c', function(x) { return 100; }, h4);
    test.equal(hamt.get('a', h5), 6);
    test.equal(hamt.get('b', h5), 10);
    test.equal(hamt.get('c', h5), 100);

    test.done();
};

