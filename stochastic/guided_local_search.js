/*******************************************************************************
Clever Algorithms, pg 50
Guided Local Search: The strategy for the Guided Local Search algorithm is
to use penalties to encourage a Local Search technique to escape local optima
and discover the global optima. A Local Search algorithm is run until it gets
stuck in a local optima. The features from the local optima are evaluated
and penalized, the results of which are used in an augmented cost function
employed by the Local Search procedure. The Local Search is repeated a number
of times using the last local optima discovered and the augmented cost
function that guides exploration away from solutions with features
present in discovered local optima.
*******************************************************************************/
const { euclid2D, randomPermutation, stochasticTwoOpt } = require('../utils')
/**
* augmentedCost: augments the cost of the route determined by the use of penalties
* @param {Array} permutation: Current route permutation
* @param {Array} penalties: Array of penalties
* @param {Array} cities: 2D array of all available cities
* @param {Number} lambda: coeffcient for scaling penalties
* @returns {Object} distance: distance for the permutation, augmented: augmented cost
* @called
**/
const augmentedCost = ({ permutation, penalties, cities, lambda }) => {
  try {
    let distance = 0
    let augmented = 0
    permutation.map((c1,i) => {
      let c2 = (i === permutation.length-1) ? permutation[0] : permutation[i+1]
      if (c2 < c1) {
        c1 = c2
        c2 = c1
      }
      let d = euclid2D({ c1: cities[c1], c2: cities[c2] })
      distance += d
      augmented += d + (lambda * penalties[c1][c2])
      return c1
    })
    return [distance, augmented]
  } catch (e) {
    throw new Error(`Augmented cost: ${e}`)
  }
}

/**
* cost: Calculates cost of route
* @param {Array} cand: Current candidate permutation
* @param {Array} penalties: Array of penalties
* @param {Array} cities: 2D array of all available cities
* @param {Number} lambda: coeffcient for scaling penalties
* @returns {Number} distance of routes
* @called
**/
const cost = ({ cand, penalties, cities, lambda }) => {
  try {
    let [cost, acost] = augmentedCost({
      permutation: cand.vector,
      penalties,
      cities,
      lambda
    })
    cand.cost = cost
    cand.augCost = acost
  } catch (e) {
    throw new Error(`Cost: ${e}`)
  }
}

/**
* localSearch: Search through local optima
* @param {Array} current: Current candidate permutation
* @param {Array} cities: 2D array of all available cities
* @param {Array} penalties: Array of penalties
* @param {Number} maxNoImprov: Determines when the search can no longer improve
* @param {Number} lambda: coeffcient for scaling penalties
* @returns {Object} current permutation
* @called
**/
const localSearch = ({ current, cities, penalties, maxNoImprov, lambda }) => {
  try {
    let count = 0
    cost({ cand: current, penalties, cities, lambda })
    do {
      let candidate = { vector: stochasticTwoOpt(current.vector) }
      cost({ cand: candidate, penalties, cities, lambda })
      if (candidate.augCost < current.augCost) count = 0
      else count += 1
      if (candidate.augCost < current.augCost) current = candidate
    } while (count <= maxNoImprov)
    return current
  } catch (e) {
    throw new Error(`Local search: ${e}`)
  }
}

/**
* calculateFeatureUtilities: Used for penalizing a feature/maximizing utility
* @param {Array} penal: Array of penalties
* @param {Array} cities: 2D array of all available cities
* @param {Array} permutation: Current candidate permutation
* @returns {Array} utilities features
* @called
**/
const calculateFeatureUtilities = ({ penal, cities, permutation }) => {
  try {
    let utilities = new Array(permutation.length).fill(0)
    permutation.map((c1, i) => {
      let c2 = (i === permutation.length-1) ? permutation[0] : permutation[i+1]
      if (c2 < c1) {
        c1 = c2
        c2 = c1
      }
      utilities[i] = euclid2D({ c1: cities[c1], c2: cities[c2] }) / (1.0 + penal[c1][c2])
      return c1
    })
    return utilities
  } catch (e) {
    throw new Error(`Calculate feature utilities: ${e}`)
  }
}

/**
* updatePenalities: Updates penalty values
* @param {Array} penalties: Array of penalties
* @param {Array} cities: 2D array of all available cities
* @param {Array} permutation: Current candidate permutation
* @param {Array} utilities: utility features
* @returns {Array} penalties
* @called
**/
const updatePenalities = ({ penalties, cities, permutation, utilities }) => {
  try {
    let max = Math.max(...utilities)
    permutation.map((c1, i) => {
      let c2 = (i === permutation.length-1) ? permutation[0] : permutation[i+1]
      if (c2 < c1) {
        c1 = c2
        c2 = c1
      }
      if (utilities[i] === max) penalties[c1][c2] += 1
      return c1
    })
    return penalties
  } catch (e) {
    throw new Error(`Update penalties: ${e}`)
  }
}

/**
* guidedLocalSearch: Main guided search function
* @param {Number} maxIter: max iterations
* @param {Array} cities: 2D array of all available cities
* @param {Number} maxNoImprov: Determines when the search can no longer improve
* @param {Number} lambda: coeffcient for scaling penalties
* @returns {Object} best candidate solution to TSP
* @called
**/
const guidedLocalSearch = ({ maxIter, cities, maxNoImprov, lambda }) => {
  try {
    let best = null
    let current = { vector: randomPermutation(cities) }
    let penalties = new Array(cities.length).fill(new Array(cities.length).fill(0))
    for (let i = 0; i < maxIter; i++) {
      current = localSearch({ current, cities, penalties, maxNoImprov, lambda })
      let utilities = calculateFeatureUtilities({
        penal: penalties,
        cities,
        permutation: current.vector
      })
      penalties = updatePenalities({
        penalties,
        cities,
        permutation: current.vector,
        utilities
      })
      if (best === null || current.cost < best.cost) best = current
      console.log(`> Iteration: ${i+1}, Best: ${best.cost}, Aug: ${best.augCost}`)
    }
    return best
  } catch (e) {
    throw new Error(`Guided local search: ${e}`)
  }
}


module.exports = { guidedLocalSearch }

/* END */
