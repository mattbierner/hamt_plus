"use strict";
const hamt = require('../hamt');
const assert = require('chai').assert;

describe('tryGet', () => {
    it('should return default for empty map', () => {
        assert.strictEqual(10, hamt.tryGet(10, 'a', hamt.make()));
        assert.strictEqual(10, hamt.make().tryGet(10, 'a'));

        assert.strictEqual(10, hamt.tryGet(10, 'b', hamt.make()));
        assert.strictEqual(false, hamt.tryGet(false, 'a', hamt.make()));

        const a = {};
        assert.strictEqual(a, hamt.tryGet(a, 'b', hamt.make()));

    });

    it('should return default for non-existant value', () => {
        var h1 = hamt.make().set('a', 3);

        assert.strictEqual(3, hamt.tryGet(10, 'a', h1));
        assert.strictEqual(10, hamt.tryGet(10, 'b', h1));
    });

    it('should uesd custom keyEq', () => {
        var h1 = hamt.make({
          keyEq: (x, y) => x.value === y.value
        })
          .set({value: 'a'}, 3)
          .set({value: 'b'}, 5);

        assert.strictEqual(3, hamt.get({value: 'a'}, h1));
        assert.strictEqual(undefined, hamt.get('a', h1));
        assert.strictEqual(5, hamt.get({value: 'b'}, h1));
        assert.strictEqual(undefined, hamt.get('b', h1));
    });

    it('should work on array nodes correctly', () => {
        const insert = [
            "n", "U", "p", "^", "h", "w", "W", "x", "S", "f", "H", "m", "g",
            "l", "b", "_", "V", "Z", "G", "o", "F", "Q", "a", "k", "j", "r",
            "B", "A", "y", "\\", "R", "D", "i", "c", "]", "C", "[", "e", "s",
            "t", "J", "E", "q", "v", "M", "T", "N", "L", "K", "Y", "d", "P",
            "u", "I", "O", "`", "X"];

        let h = hamt.make();
        for (let i = 0; i < insert.length; ++i) {
            h = h.setHash(i, insert[i], insert[i]);
        }

        assert.strictEqual(insert.length, h.count());

        for (let i = 0; i < insert.length; ++i) {
            const x = insert[i];
            assert.strictEqual(x, h.tryGetHash(null, i, x));
            assert.strictEqual(null, h.tryGetHash(null, i, x + x));
        }
    });
});
