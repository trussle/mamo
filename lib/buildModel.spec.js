const expect = require("chai").expect

const buildModel = require("./buildModel")

describe("buildModel", () => {

  let model

  beforeEach(() => {

    model = buildModel({
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

      a: 3,
      b: function() { return this.a - 1 }
    })

  })

  it("can return constants that have been defined", () => {
    expect(model.a).to.equal(3)
    expect(model.b).to.equal(2)
  })

  it("can return computed definitions", () => {
    expect(model.product).to.equal(6)
    expect(model.sum).to.equal(5)
  })

  it("can return computed definitions, which require further computed definitions", () => {
    expect(model.result).to.equal(1)
  })

  it("supports the scenario1 in the README", () => {
    const scenario1 = model.where({ a: 4 })
    expect(scenario1.result).to.equal(5)
  })

  it("supports the scenario2 in the README", () => {
    const scenario2 = model.where({ product: 4, sum: 2 })
    expect(scenario2.result).to.equal(2)
  })

})
