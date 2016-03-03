const assert = require("chai").assert;

const dedupe = require("../index.js");

describe("dedupe", () => {
  describe(".one()", () => {
    it("should dedupe a single array of primitives", () => {
      const beforeItems = [1, 1, 2, 1, 3, "a", 2, "b", "a", "b"];
      const afterItems = [1, 2, 3, "a", "b"];
      assert.deepEqual(dedupe.one(beforeItems), afterItems);
    });
    it("should dedupe a single array of objects", () => {
      const beforeItems = [{id: 1}, {id: 2}, {id: 2}, {id: 2}, {id: 2}, {id: 3}, {id: 1}];
      const afterItems = [{id: 1}, {id: 2}, {id: 3}];
      assert.deepEqual(dedupe.one(beforeItems, item => item.id), afterItems);
    });
    it("should take a custom comparison function", () => {
      const beforeItems = [{id: 1, amount: 50}, {id: 1, amount: 100}];
      const afterItems = [{id: 1, amount: 100}];
      function compare(previous, current) {
        return current.amount > previous.amount;
      }
      assert.deepEqual(dedupe.one(beforeItems, item => item.id, compare), afterItems);
    });
  });
  describe(".group()", () => {
    it("should remove duplicates inside the groups", () => {
      const beforeItems = [[1, 1, 1], [2, 2, 2], [3, 3, 3]];
      const afterItems = [[1], [2], [3]];
      assert.deepEqual(dedupe.group(beforeItems), afterItems);
    });
    it("should remove duplicates between groups, favouring earlier groups", () => {
      const beforeItems = [[1, 2, 3], [2, 3, 4], [3, 4, 5]];
      const afterItems = [[1, 2, 3], [4], [5]];
      assert.deepEqual(dedupe.group(beforeItems), afterItems);
    });
    it("should remove duplicates from groups of objects", () => {
      const beforeItems = [[{id: 1}, {id: 1}, {id: 2}], [{id: 1}, {id: 3}, {id: 2}], [{id: 1}, {id: 2}, {id: 5}]];
      const afterItems = [[{id: 1}, {id: 2}], [{id: 3}], [{id: 5}]];
      assert.deepEqual(dedupe.group(beforeItems, item => item.id), afterItems);
    });
    it("should take a custom comparison function", () => {
      const beforeItems = [
        [{id: 1, amount: 50}, {id: 1, amount: 100}],
        [{id: 1, amount: 200}, {id: 2, amount: 0}, {id: 2, amount: 100}]
      ];
      const afterItems = [
        [{id: 1, amount: 100}],
        [{id: 2, amount: 100}]
      ];

      function compare(previous, current) {
        return current.amount > previous.amount;
      }
      assert.deepEqual(dedupe.group(beforeItems, item => item.id, compare), afterItems);
    });
  });
  describe("defaults", () => {
    const originalDefaults = {
      createKey: (item => item),
      compare: (() => false)
    };
    afterEach(() => {
      dedupe.defaults = originalDefaults;
    });
    it("should allow overriding of createKey", () => {
      dedupe.defaults.createKey = (item => item.id);
      const beforeItems = [{id: 1}, {id: 2}, {id: 2}, {id: 2}, {id: 2}, {id: 3}, {id: 1}];
      const afterItems = [{id: 1}, {id: 2}, {id: 3}];
      assert.deepEqual(dedupe.one(beforeItems), afterItems);
    });
    it("should allow overriding of compare", () => {
      dedupe.defaults.compare = function compare(previous, current) {
        return current.amount > previous.amount;
      };
      const beforeItems = [{id: 1, amount: 50}, {id: 1, amount: 100}];
      const afterItems = [{id: 1, amount: 100}];
      assert.deepEqual(dedupe.one(beforeItems, item => item.id), afterItems);
    });
  });
});
