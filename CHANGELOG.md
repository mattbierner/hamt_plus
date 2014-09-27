# ChangeLog #

## 0.0.6 - September 27, 2014
* Fixed collision nodes on unexpanded branch not being expanded on insertions
  further down branch. Thanks raymond-w-ko for reporting this and providing test
  data for `hamt`.

## 0.0.5 - Aug 22, 2014
* Fixed `CollisionNode` updates not using node values.

## 0.0.4 - Aug 21, 2014
* Fixed `CollisionNode` not having an `edit` member.

## 0.0.3 - Aug 19, 2014
* Revert `fold` to fix performance degradation.

## 0.0.0 - Aug 18, 2014
* Initial release.