/*******************************************************************************
Clever Algorithms, pg 30
Random Search: The strategy of Random Search is to sample solutions from across the
entire search space using a uniform probability distribution. Each future
sample is independent of the samples that come before it.
*******************************************************************************/
const { objectiveFunction, randomVector } = require('../utils')

/**
* randomSearch: Searches through random values and finds the lowest cost within the search space
* @param {Array} searchSpace: 2D vector of the possible search space
* @param {Number} maxIter: max iterations
* @returns {Object} Best candidate solution
**/
const randomSearch = ({ searchSpace, maxIter }) => {
  try {
    let best = null
    for (let i = 0; i < maxIter; i++) {
      let candidate = { vector: randomVector(searchSpace) }
      candidate.cost = objectiveFunction(candidate.vector)
      if (best === null || candidate.cost < best.cost) best = candidate
      console.log(`> Iteration: ${i+1}, Best: ${best.cost}`)
    }
    return best
  } catch (e) {
    throw new Error(`Random search: ${e}`)
  }
}

module.exports = { randomSearch }

/* END */
