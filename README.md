# MaMo

*Maintained by [@jonnyarnold](https://github.com/jonnyarnold/)*

The **Ma**thematical **Mo**delling Helper you never knew you didn't need.

## Installation

It's an NPM package:

```sh
npm install --save mamo
```

## Usage

MaMo can be used to model systems of equations. For example, if you had the system:

```
  r = s - p
  s = a + b
  p = a * b
  b = a - 1
```

you can use a MaMo model to represent them and perform some fun experiments.

```js
const mamo = require("mamo")

const contrivedExample = mamo.buildModel({
  result: function() {
    return this.product - this.sum
  },

  sum: function() {
    return (this.a + this.b)
    || (this.product - this.result)
  },

  product: function() {
    return (this.a * this.b)
      || (this.result + this.sum)
  },

  b: function() { return this.a - 1 }
})

// Supports defining dangling variables!
const scenario1 = contrivedExample.where({ a: 4 })
console.log(scenario1.result) // (4 * 3) - (4 + 3) = 5

// Supports overriding relations!
const scenario2 = contrivedExample.where({ product: 4, sum: 2 })
console.log(scenario2.result) // 2
```
