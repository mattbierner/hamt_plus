"use strict";
const hamt = require('../hamt');
const assert = require('chai').assert;

describe('modify', () => {
    it('should insert elements as normal into empty map', () => {

      const h1 = hamt.mutate(function(m) {
          hamt.set('a', 3, m);
          hamt.set('b', 5, m);
      }, hamt.make());

      assert.strictEqual(3, h1.get('a'));
      assert.strictEqual(3, h1.get('a'));
  });
});

exports.does_not_effect_pre_value = function(test) {
    const h = hamt.set('a', 100, hamt.make());

    const h1 = hamt.mutate(function(m) {
        hamt.set('a', 3, m);
        hamt.set('b', 5, m);
    }, h);

    assert.strictEqual(hamt.get('a', h), 100);
    assert.strictEqual(hamt.get('a', h1), 3);

    assert.strictEqual(hamt.get('b', h), null);
    assert.strictEqual(hamt.get('b', h1), 5);


};

exports.does_not_effect_post_value = function(test) {
    const h = hamt.mutate(function(m) {
        hamt.set('a', 3, m);
        hamt.set('b', 5, m);
    }, hamt.make());

    const h1 = hamt.set('a', 100, h);


    assert.strictEqual(hamt.get('a', h), 3);
    assert.strictEqual(hamt.get('a', h1), 100);

    assert.strictEqual(hamt.get('b', h), 5);
    assert.strictEqual(hamt.get('b', h1), 5);


};


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
