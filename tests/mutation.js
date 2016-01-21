"use strict";
const hamt = require('../hamt');
const assert = require('chai').assert;

describe('modify', () => {
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
      assert.strictEqual(3, h1.get('a'));
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

});

exports.mutations_do_not_effect_one_another = function(test) {
    const h = hamt.set('a', 100, hamt.make());

    const h1 = hamt.mutate(function(m) {
        hamt.set('a', 3, m);
        hamt.set('b', 5, m);
    }, h);

    const h2 = hamt.mutate(function(m) {
        hamt.set('a', 30, m);
        hamt.set('b', 50, m);
    }, h1);

    assert.strictEqual(hamt.get('a', h), 100);
    assert.strictEqual(hamt.get('a', h1), 3);
    assert.strictEqual(hamt.get('a', h2), 30);

    assert.strictEqual(hamt.get('b', h), null);
    assert.strictEqual(hamt.get('b', h1), 5);
    assert.strictEqual(hamt.get('b', h2), 50);


};

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
