# fancy-dedupe

## Usage

```
npm install fancy-dedupe --save
```

```js
const dedupe = require("fancy-dedupe");
```

## API

### dedupe.one(items, [createKey])

Use `dedupe.one` to dedupe a single array of items. For an array of primitives, all you need is the first parameter:

```js
dedupe.one([1, 1, 2]);
// => [1, 2]
```

You may also supply a custom comparison function, `createKey`. It should return a primitive value.

```js
function getId(item) {
  return item.id;
}

dedupe.one([{id: 1}, {id: 1}, {id: 2}], getId);
// => [{id: 1}, {id: 2}]
```

### dedupe.group(group, [createKey])

Use `dedupe.group` to dedupe multiple arrays of items. Earlier arrays in the group take preference. Like `dedupe.one`, you may supply a `createKey` function. Each array will also be individually deduped.

```js
dedupe.group([
  [1, 1, 2],
  [2, 3, 4]
]);
// => [[1, 2], [3, 4]]
```
