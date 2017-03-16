"use strict";
const hamt = require('../hamt');
const assert = require('chai').assert;

describe('mutate', () => {
    it('should insert single element into empty map', () => {
        const h1 = hamt.mutate(function (m) {
            hamt.set('a', 3, m);
        }, hamt.make());

        assert.strictEqual(1, h1.count());
        assert.strictEqual(3, h1.get('a'));
    });

    it('should insert elements as normal into empty map', () => {
        const h1 = hamt.mutate(function (m) {
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

    it('should not leak mutation to values before scope', () => {
        const h = hamt.set('a', 100, hamt.make());

        const h1 = hamt.mutate(function (m) {
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
        const h = hamt.mutate(function (m) {
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

        const h1 = hamt.mutate(function (m) {
            hamt.set('a', 3, m);
            hamt.set('b', 5, m);
        }, h);

        const h2 = hamt.mutate(function (m) {
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

    it('should handle many insertions correctly', () => {
        const insert = [
            "The", "Time", "Traveller", "for", "so", "it", "will", "be",
            "convenient", "to", "speak", "of", "him", "was", "expounding",
            "a", "recondite", "matter", "us", "His", "grey", "eyes",
            "shone", "twinkled", "his", "usually", "pale",
            "face", "flushed", "animated"];

        const h = hamt.mutate(h =>
            insert.forEach((x, i) => {
                h.set(x, x);
                assert.strictEqual(i + 1, h.count());
            }),
            hamt.empty);

        assert.strictEqual(insert.length, h.size);
        insert.forEach(x =>
            assert.strictEqual(x, h.get(x)));

        const h1 = hamt.mutate(h => {
            insert.forEach((x, i) => {
                h.set(x + x, x);
                assert.strictEqual(insert.length + i + 1, h.count());
            });
        }, h);

        assert.strictEqual(insert.length, h.size);
        insert.forEach(x =>
            assert.strictEqual(x, h.get(x)));

        assert.strictEqual(insert.length * 2, h1.size);
        insert.forEach(x => {
            assert.strictEqual(x, h1.get(x));
            assert.strictEqual(x, h1.get(x + x))
        });
    });

    it('should handle many removals correctly', () => {
        const insert = [
            "The", "Time", "Traveller", "for", "so", "it", "will", "be",
            "convenient", "to", "speak", "of", "him", "was", "expounding",
            "a", "recondite", "matter", "us", "His", "grey", "eyes",
            "shone", "twinkled", "his", "usually", "pale",
            "face", "flushed", "animated"];

        const h = hamt.mutate(h => {
            insert.forEach((x, i) => {
                h.set(x, x);
                assert.strictEqual(i + 1, h.count());
            })
            insert.forEach((x, i) => {
                h.delete(x);
                assert.strictEqual(insert.length - i - 1, h.count());
            })
        }, hamt.empty);

        assert.strictEqual(0, h.count());
    });

});
