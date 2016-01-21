"use strict";
const hamt = require('../hamt');
const assert = require('chai').assert;

describe('mutate', () => {
  it('should insert single element into empty map', () => {
      const h1 = hamt.mutate(function(m) {
          hamt.set('a', 3, m);
      }, hamt.make());

      assert.strictEqual(1, h1.count());
      assert.strictEqual(3, h1.get('a'));
  });

    it('should insert elements as normal into empty map', () => {
      const h1 = hamt.mutate(function(m) {
          hamt.set('a', 3, m);
          hamt.set('b', 5, m);
      }, hamt.make());

      assert.strictEqual(2, h1.size);
      assert.strictEqual(3, h1.get('a'));
      assert.strictEqual(5, h1.get('b'));
  });

  it('should allow for nested mutations', () => {
    let h1 = hamt.make().beginMutation().beginMutation();
    h1.set('a', 3);
    h1.set('b', 5);
    h1.endMutation();

    assert.strictEqual(2, h1.size);
    assert.strictEqual(3, h1.get('a'));
    assert.strictEqual(5, h1.get('b'));

    h1.set('a', 30);
    assert.strictEqual(2, h1.size);
    assert.strictEqual(30, h1.get('a'));
    assert.strictEqual(5, h1.get('b'));

    h1.endMutation();

    h1.set('a', 300);
    assert.strictEqual(2, h1.size);
    assert.strictEqual(30, h1.get('a'));
    assert.strictEqual(5, h1.get('b'));

});

  it('should no leak mutation to values before scope', () => {
      const h = hamt.set('a', 100, hamt.make());

      const h1 = hamt.mutate(function(m) {
          hamt.set('a', 3, m);
          hamt.set('b', 5, m);
      }, h);

      assert.strictEqual(1, h.size);
      assert.strictEqual(100, hamt.get('a', h));
      assert.strictEqual(undefined, hamt.get('b', h));

      assert.strictEqual(2, h1.size);
      assert.strictEqual(3, hamt.get('a', h1));
      assert.strictEqual(5, hamt.get('b', h1));
  });

  it('should not leak mutation to values after scope', () => {
      const h = hamt.mutate(function(m) {
          hamt.set('a', 3, m);
          hamt.set('b', 5, m);
      }, hamt.make());

      const h1 = hamt.set('a', 100, h);

      assert.strictEqual(2, h.size);
      assert.strictEqual(3, hamt.get('a', h));
      assert.strictEqual(5, hamt.get('b', h));

      assert.strictEqual(2, h1.size);
      assert.strictEqual(100, hamt.get('a', h1));
      assert.strictEqual(5, hamt.get('b', h1));
  });

  it('should not effect other mutations', () => {
      const h = hamt.set('a', 100, hamt.make());

      const h1 = hamt.mutate(function(m) {
          hamt.set('a', 3, m);
          hamt.set('b', 5, m);
      }, h);

      const h2 = hamt.mutate(function(m) {
          hamt.set('a', 30, m);
          hamt.set('b', 50, m);
      }, h1);

      assert.strictEqual(1, h.size);
      assert.strictEqual(100, hamt.get('a', h));
      assert.strictEqual(undefined, hamt.get('b', h));

      assert.strictEqual(2, h1.size);
      assert.strictEqual(3, hamt.get('a', h1));
      assert.strictEqual(5, hamt.get('b', h1));

      assert.strictEqual(2, h2.size);
      assert.strictEqual(50, hamt.get('b', h2));
      assert.strictEqual(30, hamt.get('a', h2));
  });

});

exports.many = function(test) {
    const insert = [
        "The", "Time", "Traveller", "for", "so", "it", "will", "be",
        "convenient", "to", "speak", "of", "him", "was", "expounding",
        "a", "recondite", "matter", "to", "us", "His", "grey", "eyes",
        "shone", "and", "twinkled", "and", "his", "usually", "pale",
        "face", "was", "flushed", "and", "animated"];

    const h = hamt.mutate(function(h) {
        insert.forEach(function(x) {
            hamt.set(x, x, h);
        });
    }, hamt.make());

    containsAll(test,
        hamt.values(h),
        insert);


};
