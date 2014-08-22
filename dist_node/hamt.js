/*
 * THIS FILE IS AUTO GENERATED FROM 'lib/hamt.kep'
 * DO NOT EDIT
*/
"use strict";
var hash, make, beginMutation, endMutation, mutate, tryGet, get, has, set, modify, remove, fold, count, pairs, keys,
        values, __seq = (function(x, y) {
            return (x === y);
        }),
    BUCKET_SIZE = Math.pow(2, 5),
    mask = (BUCKET_SIZE - 1),
    MAX_INDEX_NODE = (BUCKET_SIZE / 2),
    MIN_ARRAY_NODE = (BUCKET_SIZE / 4),
    nothing = ({}),
    popcount = (function(x) {
        var x0 = (x - ((x >> 1) & 1431655765)),
            x1 = ((x0 & 858993459) + ((x0 >> 2) & 858993459)),
            x2 = ((x1 + (x1 >> 4)) & 252645135),
            x3 = (x2 + (x2 >> 8)),
            x4 = (x3 + (x3 >> 16));
        return (x4 & 127);
    }),
    arrayUpdate = (function(mutate, at, v, arr) {
        var out = (mutate ? arr : arr.slice());
        (out[at] = v);
        return out;
    }),
    arraySpliceOut = (function(mutate, at, arr) {
        var out = (mutate ? arr : arr.slice());
        out.splice(at, 1);
        return out;
    }),
    arraySpliceIn = (function(mutate, at, v, arr) {
        var out = (mutate ? arr : arr.slice());
        out.splice(at, 0, v);
        return out;
    });
(hash = (function(str) {
    if (((typeof str) === "number")) return str;
    var hash0 = 0;
    for (var i = 0, len = str.length;
        (i < len);
        (i = (i + 1))) {
        var c = str.charCodeAt(i);
        (hash0 = ((((hash0 << 5) - hash0) + c) | 0));
    }
    return hash0;
}));
var Leaf = (function(edit, hash0, key, value) {
    var self = this;
    (self.edit = edit);
    (self.hash = hash0);
    (self.key = key);
    (self.value = value);
}),
    Collision = (function(edit, hash0, children) {
        var self = this;
        (self.edit = edit);
        (self.hash = hash0);
        (self.children = children);
    }),
    IndexedNode = (function(edit, mask0, children) {
        var self = this;
        (self.edit = edit);
        (self.mask = mask0);
        (self.children = children);
    }),
    ArrayNode = (function(edit, count, children) {
        var self = this;
        (self.edit = edit);
        (self.count = count);
        (self.children = children);
    }),
    isLeaf = (function(node) {
        return (((node === null) || (node instanceof Leaf)) || (node instanceof Collision));
    }),
    expand = (function(edit, frag, child, bitmap, children) {
        var bit = bitmap,
            arr = [],
            count = 0;
        for (var i = 0; bit;
            (i = (i + 1))) {
            if ((bit & 1)) {
                (arr[i] = children[count]);
                (count = (count + 1));
            }
            (bit = (bit >>> 1));
        }
        (arr[frag] = child);
        return new(ArrayNode)(edit, (count + 1), arr);
    }),
    pack = (function(edit, removed, children) {
        var packed = [],
            bitmap = 0;
        for (var i = 0, len = children.length;
            (i < len);
            (i = (i + 1))) {
            var elem = children[i];
            if (((i !== removed) && (!(!elem)))) {
                packed.push(elem);
                (bitmap = (bitmap | (1 << i)));
            }
        }
        return new(IndexedNode)(edit, bitmap, packed);
    }),
    mergeLeaves = (function(edit, shift, n1, n2) {
        var h1 = n1.hash,
            h2 = n2.hash,
            subH1, subH2;
        return ((h1 === h2) ? new(Collision)(edit, h1, [n2, n1]) : ((subH1 = ((h1 >>> shift) & mask)), (subH2 = ((
            h2 >>> shift) & mask)), new(IndexedNode)(edit, ((1 << subH1) | (1 << subH2)), ((subH1 === subH2) ? [
            mergeLeaves(edit, (shift + 5), n1, n2)
        ] : ((subH1 < subH2) ? [n1, n2] : [n2, n1])))));
    }),
    modifyCollisionList = (function(mutate, eq, edit, h, list, f, k) {
        var target, i = 0;
        for (var len = list.length;
            (i < len);
            (i = (i + 1))) {
            var child = list[i];
            if ((child.key === k)) {
                (target = child);
                break;
            }
        }
        var v = (target ? f(target.value) : f());
        if ((nothing === v)) return arraySpliceOut(mutate, i, list);
        else {
            return arrayUpdate(mutate, i, (target ? target.modify(mutate, eq, edit, 0, f, h, k) : new(Leaf)(edit, h,
                k, v)), list);
        }
    }),
    Tree = (function(mutable, edit, config, root) {
        var self = this;
        (self.mutable = mutable);
        (self.edit = edit);
        (self.config = config);
        (self.root = root);
    });
(Tree.setRoot = (function(root, tree) {
    if (tree.mutable) {
        (tree.root = root);
        return tree;
    }
    return new(Tree)(tree.mutable, tree.edit, tree.config, root);
}));
(make = (function(config) {
    return new(Tree)(false, 0, ({
        keyEq: ((config && config.keyEq) || __seq),
        hash: ((config && config.hash) || hash)
    }), null);
}));
(beginMutation = (function(tree) {
    return new(Tree)(true, (tree.edit + 1), tree.config, tree.root);
}));
(endMutation = (function(tree) {
    return new(Tree)(false, tree.edit, tree.config, tree.root);
}));
(mutate = (function(f, m) {
    var t = new(Tree)(true, (m.edit + 1), m.config, m.root);
    f(t);
    var tree = t;
    return new(Tree)(false, tree.edit, tree.config, tree.root);
}));
var lookup;
(Leaf.prototype.lookup = (function(eq, _, _0, k) {
    var self = this;
    return (eq(self.key, k) ? self.value : nothing);
}));
(Collision.prototype.lookup = (function(eq, _, h, k) {
    var self = this;
    if ((h === self.hash)) {
        for (var i = 0, len = self.children.length;
            (i < len);
            (i = (i + 1))) {
            var child = self.children[i];
            if (eq(child.key, k)) return child.value;
        }
    }
    return nothing;
}));
(IndexedNode.prototype.lookup = (function(eq, shift, h, k) {
    var self = this,
        frag = ((h >>> shift) & mask),
        bit = (1 << frag),
        bitmap;
    return ((self.mask & bit) ? lookup(eq, self.children[((bitmap = self.mask), popcount((bitmap & (bit - 1))))], (
        shift + 5), h, k) : nothing);
}));
(ArrayNode.prototype.lookup = (function(eq, shift, h, k) {
    var self = this,
        frag = ((h >>> shift) & mask),
        child = self.children[frag];
    return lookup(eq, child, (shift + 5), h, k);
}));
(lookup = (function(eq, n, shift, h, k) {
    return ((!n) ? nothing : n.lookup(eq, shift, h, k));
}));
var alter;
(Leaf.prototype.modify = (function(mutate0, eq, edit, shift, f, h, k) {
    var self = this;
    if (eq(self.key, k)) {
        var v = f(self.value);
        if ((nothing === v)) return null;
        if ((edit === self.edit)) {
            (self.value = v);
            return self;
        } else {
            return new(Leaf)(edit, h, k, v);
        }
    }
    var v0 = f();
    return ((nothing === v0) ? self : mergeLeaves(edit, shift, self, new(Leaf)(edit, h, k, v0)));
}));
(Collision.prototype.modify = (function(mutate0, eq, edit, shift, f, h, k) {
    var self = this,
        list = modifyCollisionList((mutate0 && (edit === self.edit)), eq, edit, h, self.children, f, k);
    if ((list.length <= 1)) return list[0];
    return ((mutate0 && (edit === self.edit)) ? self : new(Collision)(edit, h, list));
}));
(IndexedNode.prototype.modify = (function(mutate0, eq, edit, shift, f, h, k) {
    var self = this,
        children = self["children"],
        node, bitmap, e = (mutate0 && ((node = self), (edit === node.edit))),
        frag = ((h >>> shift) & mask),
        bit = (1 << frag),
        indx = ((bitmap = self.mask), popcount((bitmap & (bit - 1)))),
        exists = (self.mask & bit),
        child = alter(e, eq, edit, (exists ? children[indx] : null), (shift + 5), f, h, k),
        removed = (exists && (!child)),
        added = ((!exists) && (!(!child))),
        bitmap0 = (removed ? (self.mask & (~bit)) : (added ? (self.mask | bit) : self.mask));
    if ((!bitmap0)) {
        return null;
    }
    var newChildren;
    if (removed) {
        if (((children.length <= 2) && isLeaf(children[(indx ^ 1)]))) {
            return children[(indx ^ 1)];
        }
        (newChildren = arraySpliceOut(e, indx, children));
    } else if (added) {
        if ((self.children.length >= MAX_INDEX_NODE)) return expand(edit, frag, child, self.mask, children);
        (newChildren = arraySpliceIn(e, indx, child, children));
    } else {
        (newChildren = arrayUpdate(e, indx, child, children));
    }
    if (e) {
        (self.mask = bitmap0);
        (self.children = newChildren);
        return self;
    } else {
        return new(IndexedNode)(edit, bitmap0, newChildren);
    }
}));
(ArrayNode.prototype.modify = (function(mutate0, eq, edit, shift, f, h, k) {
    var self = this,
        count = self["count"],
        children = self["children"],
        node, x, x0, x1, x2, e = (mutate0 && ((node = self), (edit === node.edit))),
        frag = ((h >>> shift) & mask),
        child = children[frag],
        newChild = alter(e, eq, edit, child, (shift + 5), f, h, k),
        newCount, newChildren;
    if ((((x = child), (!x)) && (!((x0 = newChild), (!x0))))) {
        (newCount = (count + 1));
        (newChildren = arrayUpdate(e, frag, newChild, children));
    } else if (((!((x1 = child), (!x1))) && ((x2 = newChild), (!x2)))) {
        if (((self.count - 1) <= MIN_ARRAY_NODE)) return pack(edit, frag, self.children);
        (newCount = (count - 1));
        (newChildren = arrayUpdate(e, frag, null, children));
    } else {
        (newCount = count);
        (newChildren = arrayUpdate(e, frag, newChild, children));
    }
    if (e) {
        (self.count = newCount);
        (self.children = newChildren);
        return self;
    } else {
        return new(ArrayNode)(edit, newCount, newChildren);
    }
}));
(alter = (function(mutate0, eq, edit, n, shift, f, h, k) {
    var v;
    return ((!n) ? ((v = f()), ((nothing === v) ? null : new(Leaf)(edit, h, k, v))) : n.modify(mutate0, eq, (
        mutate0 ? edit : 0), shift, f, h, k));
}));
(tryGet = (function(alt, k, m) {
    var eq = m.config.keyEq,
        n = m.root,
        h = m.config.hash(k),
        val = ((!n) ? nothing : n.lookup(eq, 0, h, k));
    return ((nothing === val) ? alt : val);
}));
(get = (function(k, m) {
    var eq = m.config.keyEq,
        n = m.root,
        h = m.config.hash(k),
        val = ((!n) ? nothing : n.lookup(eq, 0, h, k));
    return ((nothing === val) ? null : val);
}));
(has = (function(k, m) {
    var eq, n, h, val, y;
    return (!((eq = m.config.keyEq), (n = m.root), (h = m.config.hash(k)), (val = ((!n) ? nothing : n.lookup(eq,
        0, h, k))), (y = ((nothing === val) ? nothing : val)), (nothing === y)));
}));
(modify = (function(k, f, m) {
    var mutate0, eq, edit, n, h, v;
    return Tree.setRoot(((mutate0 = m.mutable), (eq = m.config.keyEq), (edit = m.edit), (n = m.root), (h = m.config
        .hash(k)), ((!n) ? ((v = f()), ((nothing === v) ? null : new(Leaf)(edit, h, k, v))) : n.modify(
        mutate0, eq, (mutate0 ? edit : 0), 0, f, h, k))), m);
}));
(set = (function(k, v, m) {
    var f = (function() {
        return v;
    }),
        mutate0, eq, edit, n, h;
    return Tree.setRoot(((mutate0 = m.mutable), (eq = m.config.keyEq), (edit = m.edit), (n = m.root), (h = m.config
        .hash(k)), ((!n) ? ((nothing === v) ? null : new(Leaf)(edit, h, k, v)) : n.modify(mutate0, eq, (
        mutate0 ? edit : 0), 0, f, h, k))), m);
}));
var del = (function() {
    return nothing;
});
(remove = (function(k, m) {
    var mutate0, eq, edit, n, h;
    return Tree.setRoot(((mutate0 = m.mutable), (eq = m.config.keyEq), (edit = m.edit), (n = m.root), (h = m.config
        .hash(k)), ((!n) ? ((nothing === nothing) ? null : new(Leaf)(edit, h, k, nothing)) : n.modify(
        mutate0, eq, (mutate0 ? edit : 0), 0, del, h, k))), m);
}));
(Leaf.prototype.fold = (function(f, z) {
    var self = this;
    return f(z, self);
}));
(Collision.prototype.fold = (function(f, z) {
    var __o = this,
        children = __o["children"];
    return children.reduce(f, z);
}));
(IndexedNode.prototype.fold = (function(f, z) {
    var __o = this,
        children = __o["children"],
        z1 = z;
    for (var i = 0, len = children.length;
        (i < len);
        (i = (i + 1))) {
        var c = children[i];
        (z1 = ((c instanceof Leaf) ? f(z1, c) : c.fold(f, z1)));
    }
    return z1;
}));
(ArrayNode.prototype.fold = (function(f, z) {
    var __o = this,
        children = __o["children"],
        z1 = z;
    for (var i = 0, len = children.length;
        (i < len);
        (i = (i + 1))) {
        var c = children[i];
        if (c) {
            (z1 = ((c instanceof Leaf) ? f(z1, c) : c.fold(f, z1)));
        }
    }
    return z1;
}));
(fold = (function(f, z, __o) {
    var root = __o["root"];
    return ((!root) ? z : root.fold(f, z));
}));
var f = (function(y) {
    return (1 + y);
});
(count = (function(__o) {
    var root = __o["root"];
    return ((!root) ? 0 : root.fold(f, 0));
}));
var build = (function(p, __o) {
    var key = __o["key"],
        value = __o["value"];
    p.push([key, value]);
    return p;
});
(pairs = (function(m) {
    var z = [],
        root = m["root"];
    return ((!root) ? z : root.fold(build, z));
}));
var build0 = (function(p, __o) {
    var key = __o["key"];
    p.push(key);
    return p;
});
(keys = (function(m) {
    var z = [],
        root = m["root"];
    return ((!root) ? z : root.fold(build0, z));
}));
var build1 = (function(p, __o) {
    var value = __o["value"];
    p.push(value);
    return p;
});
(values = (function(m) {
    var z = [],
        root = m["root"];
    return ((!root) ? z : root.fold(build1, z));
}));
(exports["hash"] = hash);
(exports["make"] = make);
(exports["beginMutation"] = beginMutation);
(exports["endMutation"] = endMutation);
(exports["mutate"] = mutate);
(exports["tryGet"] = tryGet);
(exports["get"] = get);
(exports["has"] = has);
(exports["set"] = set);
(exports["modify"] = modify);
(exports["remove"] = remove);
(exports["fold"] = fold);
(exports["count"] = count);
(exports["pairs"] = pairs);
(exports["keys"] = keys);
(exports["values"] = values);