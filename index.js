"use strict";

module.exports = {
  defaults: {
    createKey: (item => item),
    compare: (() => false)
  },
  one(values, createKey, compare) {
    createKey = createKey || this.defaults.createKey;
    compare = compare || this.defaults.compare;
    const valueMap = new Map();
    values.forEach(value => {
      const key = createKey(value);
      if (!valueMap.has(key) || compare(valueMap.get(key), value)) {
        valueMap.set(key, value);
      }
    });
    return Array.from(valueMap.values());
  },

  group(groups, createKey, compare) {
    const globalKeys = new Set();
    const result = [];
    createKey = createKey || this.defaults.createKey;
    compare = compare || this.defaults.compare;
    groups.forEach(values => {
      const valueMap = new Map();
      values.forEach(value => {
        const key = createKey(value);
        if (!globalKeys.has(key) && (!valueMap.has(key) || compare(valueMap.get(key), value))) {
          valueMap.set(key, value);
        }
      });
      result.push(valueMap);
      valueMap.forEach((value, key) => globalKeys.add(key));
    });
    return result.map(m => Array.from(m.values()));
  }
};
