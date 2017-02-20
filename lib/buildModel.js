// A Mathematical Model. Provides auto-solving capabilities
// for mathematical relations, rather than having to write
// every possible combination of properties.
//
// To use it, extend the Model and add getters to the object.
function buildModel(relations) {
  const world = worldWith({ relations })
  return proxyFor(world)
}

// The world keeps track of state.
function worldWith(opts) {
  return {
    // Fixed values defined externally.
    constants: opts.constants || {},

    // Functions that compute values.
    relations: opts.relations,

    // A cache of computed values.
    computed: {},

    // A stack that keeps track of computations in progress
    // to avoid infinite loops.
    computeStack: [],
  }
}

// Returns a proxy for the given world that
// makes this.x work in relations.
function proxyFor(world) {
  const proxy = new Proxy(world, {

    get(world, name) {

      // Check we haven't been given it...
      if (world.constants[name] !== undefined) return world.constants[name]

      // ...or already computed it.
      if (world.computed[name] !== undefined) return world.computed[name]

      // If we haven't, then we'll compute it.
      //
      // However, we need to avoid infinite loops.
      // This is done by keeping track of what's been asked for,
      // and returning undefined if we ever ask for the same thing
      // twice in a computation.
      if (world.computeStack.indexOf(name) !== -1) return undefined

      const relation = world.relations[name]
      if (relation === undefined) { throw new Error(`${name.toString()} is not defined.`) }

      // We use the stack to keep track of what we're computing.
      world.computeStack.push(name)
      const result = relation.apply(proxy)
      world.computed[name] = result
      world.computeStack.pop()
      return result

    },

    set(world, name, value) {
      world.constants[name] = value
    }

  })

  return proxy
}

module.exports = buildModel
