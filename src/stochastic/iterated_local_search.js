/*******************************************************************************
Clever Algorithms, pg 44
Iterated Local Search: The objective of Iterated Local Search is to improve
upon stochastic Multi-Restart Search by sampling in the broader neighborhood
of candidate solutions and using a Local Search technique to refine solutions
to their local optima. Iterated Local Search explores a sequence of
solutions created as perturbations of the current best solution, the result
of which is refined using an embedded heuristic.
Heuristics: Iterated Local Search was designed for and has been predominately
applied to discrete domains, such as combinatorial optimization
problems.
Problem: TSP
*******************************************************************************/
const { euclid2D, randomInteger, randomPermutation,
  stochasticTwoOpt } = require('../utils')

/**
* cost: Calculates the cost of route
* @param {Array} permutation: Random permutation of a city
* @param {Array} cities: 2D array of all available cities
* @returns {Number} cost between two locations
* @called
**/
const cost = ({ permutation, cities }) => {
  try {
    return permutation.reduce((acc, c1, i) => {
      let c2 = (i === permutation.length-1) ? permutation[0] : permutation[i+1]
      return acc + euclid2D({ c1: cities[c1], c2: cities[c2] })
    },0)
  } catch (e) {
    throw new Error(`Cost: ${e}`)
  }
}

/**
* localSearch: Searches through a local permutation for a local optima
* @param {Object} best: Current best candidate
* @param {Array} cities: 2D array of all available cities
* @param {Number} maxNoImprov: Integer that determines when the search can
  no longer improve
* @returns {Object} best candidate from local search
* @called
**/
const localSearch = ({ best, cities, maxNoImprov }) => {
  try {
    let count = 0
    do {
      let candidate = { vector: stochasticTwoOpt(best.vector) }
      candidate.cost = cost({ permutation: candidate.vector, cities })
      if (candidate.cost < best.cost) count = 0
      else count += 1
      if (candidate.cost < best.cost) best = candidate
    } while (count <= maxNoImprov)
    return best
  } catch (e) {
    throw new Error(`Local search: ${e}`)
  }
}

/**
* doubleBridgeMove: Generates a new permutation by taking slices of the
  existing permutation using the new random positions
* @param {Array} permutation: permutation of random indexes
* @returns {Array} New swapped array of random indexes
* @called
**/
const doubleBridgeMove = (perm) => {
  try {
    const pos1 = 1 + randomInteger(perm.length-1 / 4)
    const pos2 = pos1 + 1 + randomInteger(perm.length-1 / 4)
    const pos3 = pos2 + 1 + randomInteger(perm.length-1 / 4)
    const p1 = [ ...perm.slice(0, pos1), ...perm.slice(pos3, perm.length) ]
    const p2 = [ ...perm.slice(pos2, pos3), ...perm.slice(pos1, pos2) ]
    return [ ...p1, ...p2 ]
  } catch (e) {
    throw new Error(`Double bridge move: ${e}`)
  }
}

/**
* perturbation: Generates a candidate using the doubleBridgeMove permutation
* @param {Object} best: Current best candidate
* @param {Array} cities: 2D array of all available cities
* @returns {Object} new candidate
* @called
**/
const perturbation = ({ cities, best }) => {
  try {
    let candidate = { vector: doubleBridgeMove(best.vector) }
    candidate.cost = cost({ permutation: candidate.vector, cities })
    return candidate
  } catch (e) {
    throw new Error(`Perturbation: ${e}`)
  }
}

/**
* iteratedLocalSearch: Search algo to find best possible routes for TSP
* @param {Array} cities: 2D array of all available cities
* @param {Number} maxIter: max iterations to run
* @param {Number} maxNoImprov: Integer that determines when the search can
  no longer improve
* @returns {Object} best candidate from iterated local search
* @called
**/
const iteratedLocalSearch = ({ cities, maxIter, maxNoImprov }) => {
  try {
    let best = { vector: randomPermutation(cities) }
    best.cost = cost({ permutation: best.vector, cities })
    best = localSearch({ best, cities, maxNoImprov })

    for (let i = 0; i < maxIter; i++) {
      let candidate = perturbation({ cities, best })
      candidate = localSearch({ best: candidate, cities, maxNoImprov })
      if (candidate.cost < best.cost) best = candidate
      console.log(`> Iteration: ${i+1}, Best: ${best.cost}`)
    }
    return best
  } catch (e) {
    throw new Error(`Iterated local search: ${e}`)
  }
}


module.exports = { iteratedLocalSearch }









/* END */
