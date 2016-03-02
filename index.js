"use strict";

module.exports = {
  one(values, createKey) {
    createKey = createKey || (item => item);
    const valueMap = new Map();
    values.forEach(value => {
      const key = createKey(value);
      if (!valueMap.has(key)) valueMap.set(key, value);
    });
    return Array.from(valueMap.values());
  },

  group(groups, createKey) {
    const globalKeys = new Set();
    const result = [];
    createKey = createKey || (item => item);
    groups.forEach(values => {
      const valueMap = new Map();
      values.forEach(value => {
        const key = createKey(value);
        if (!globalKeys.has(key) && !valueMap.has(key)) valueMap.set(key, value);
      });
      result.push(valueMap);
      valueMap.forEach((value, key) => globalKeys.add(key));
    });
    return result.map(m => Array.from(m.values()));
  }
};
