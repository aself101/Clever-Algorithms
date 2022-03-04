/*******************************************************************************
Clever Algorithms, pg 188
Harmony Search: The information processing objective of the technique is to
use good candidate solutions already discovered to influence the creation of
new candidate solutions toward locating the problems optima. This is achieved
by stochastically creating candidate solutions in a step-wise manner,
where each component is either drawn randomly from a memory of high-
quality solutions, adjusted from the memory of high-quality solutions,
or assigned randomly within the bounds of the problem. The memory of
candidate solutions is initially random, and a greedy acceptance criteria
is used to admit new candidate solutions only if they have an improved
objective value, replacing an existing member.
Problem: Function optimization
*******************************************************************************/
const { objectiveFunction, randomVector, randomInBounds,
  randomInteger } = require('../utils')

/**
* createRandomHarmony: creates a random harmony within the bounds of the searchspace
* @param {Array} searchSpace: problem domain
* @returns {Object} new harmony with vector and fitness
* @called
**/
const createRandomHarmony = (searchSpace) => {
  try {
    const harmony = { vector: randomVector(searchSpace) }
    harmony.fitness = objectiveFunction(harmony.vector)
    return harmony
  } catch (e) {
    throw new Error(`Create random harmony: ${e}`)
  }
}
/**
* initializeHarmonyMemory: creates an array of random harmonies; returns fittest
* @param {Array} searchSpace: problem domain
* @param {Number} memSize: size of memory or harmonies to maintain
* @param {Number} factor: additional factor to determine how many initial 
  harmonies to create
* @returns {Array} new harmony array based on memSize
* @called
  @notes Ruby operator <=>: if a < b then -1 : a=b then 0 : a > b then 1
**/
const initializeHarmonyMemory = ({ searchSpace, memSize, factor=3 }) => {
  try {
    return new Array(memSize*factor).fill({}).map((h,i) => {
      return createRandomHarmony(searchSpace)
    }).sort((a,b) => a.fitness < b.fitness ? -1 : 1)
      .slice(0, memSize)
  } catch (e) {
    throw new Error(`Initialize harmony memory: ${e}`)
  }
}
/**
* createHarmony: creates a harmony vector
* @param {Array} searchSpace: problem domain
* @param {Array} memory: array of harmonies in memory
* @param {Number} considRate: rate of consideration
* @param {Number} adjustRate: frequency of adjustment pitches
* @param {Number} range: pitch bandwidth(size of changes)
* @returns {Array} new harmony vector
* @called
**/
const createHarmony = ({ searchSpace, memory, considRate, adjustRate, range }) => {
  try {
    let vector = new Array(searchSpace.length).fill(0)
    searchSpace.map((bounds, i) => {
      if (Math.random() < considRate) {
        let value = memory[randomInteger(memory.length-1)].vector[i]
        if (Math.random() < adjustRate) {
          value += range * randomInBounds({ min: -1.0, max: 1.0 })
        }
        if (value < bounds[0]) value = bounds[0]
        if (value > bounds[1]) value = bounds[1]
        vector[i] = value
      } else vector[i] = randomInBounds({ min: bounds[0], max: bounds[1] })
      return bounds
    })
    return { vector }
  } catch (e) {
    throw new Error(`Create harmony: ${e}`)
  }
}
/**
* harmonySearch: main search function
* @param {Array} bounds: problem domain
* @param {Number} maxIter: max iterations
* @param {Number} memSize: size of memory or harmonies to maintain
* @param {Number} considRate: rate of consideration
* @param {Number} adjustRate: frequency of adjustment pitches
* @param {Number} range: pitch bandwidth(size of changes)
* @returns {Object} best solution
* @called
**/
const harmonySearch = ({ bounds, maxIter, memSize, considRate, adjustRate, range }) => {
  try {
    let memory = initializeHarmonyMemory({ searchSpace: bounds, memSize })
    let best = memory[0]
    for (let i = 0; i < maxIter; i++) {
      let harm = createHarmony({
        searchSpace: bounds,
        memory,
        considRate, 
        adjustRate,
        range
      })
      harm.fitness = objectiveFunction(harm.vector)
      if (harm.fitness < best.fitness) best = harm
      memory.push(harm)
      memory = memory.sort((a,b) => a.fitness < b.fitness ? -1 : 1)
      memory.pop()
      console.log(`> Iteration: ${i+1}, Fitness: ${best.fitness}`)
    }
    return best
  } catch (e) {
    throw new Error(`Harmony search: ${e}`)
  }
}

module.exports = { harmonySearch }

/* END */
