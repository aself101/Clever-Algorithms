/*******************************************************************************
Clever Algorithms, pg 63
Greedy Randomized Adaptive Search: The objective of the Greedy Randomized
Adaptive Search Procedure is to repeatedly sample stochastically greedy
solutions, and then use a local search procedure to refine them to a local
optima. The strategy of the procedure is centered on the stochastic and greedy
step-wise construction mechanism that constrains the selection and
order-of-inclusion of the components of a solution based on the value they
are expected to provide.
Problem: TSP
*******************************************************************************/
const { euclid2D, randomPermutation, stochasticTwoOpt,
  randomInteger, arrayDifference } = require('../utils')

/**
* cost: Calculates cost of route
* @param {Array} perm: Current candidate permutation
* @param {Array} cities: 2D array of all available cities
* @returns {Number} distance of permutation route
* @called
**/
const cost = ({ perm, cities }) => {
  try {
    let distance = 0
    perm.map((c1, i) => {
      let c2 = (i === perm.length - 1) ? perm[0] : perm[i+1]
      distance += euclid2D({ c1: cities[c1], c2: cities[c2] })
      return c1
    })
    return distance
  } catch (e) {
    throw new Error(`Cost: ${e}`)
  }
}

/**
* localSearch: iterates through local solutions and returns best candidate
* @param {Object} best: Current candidate solution
* @param {Array} cities: 2D array of all available cities
* @param {Number} maxNoImprov: Determines when the search can no longer improve
* @returns {Object} best candidate
* @called
**/
const localSearch = ({ best, cities, maxNoImprov }) => {
  try {
    let count = 0
    do {
      let candidate = { vector: stochasticTwoOpt(best.vector) }
      candidate.cost = cost({ perm: candidate.vector, cities })
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
* constructRandomizedGreedySolution: construct a candidate solution(greedy & randomized)
* @param {Array} cities: 2D array of all available cities
* @param {Number} alpha: defines the amount of greediness(0 too greedy, 1 to general)
* @returns {Object} best candidate
* @called
**/
const constructRandomizedGreedySolution = ({ cities, alpha }) => {
  try {
    let candidate = { vector: [randomInteger(cities.length-1)] }
    let allCities = new Array(cities.length).fill(0).map((a,i) => i)
    while (candidate.vector.length < cities.length) {
      let candidates = arrayDifference({ arr1: allCities, arr2: candidate.vector })
      let costs = new Array(candidates.length).fill(0).map((c,i) => {
        return euclid2D({ c1: cities[candidate.vector.length-1], c2: cities[i] })
      })
      let rcl = []
      let max = Math.max(...costs)
      let min = Math.min(...costs)
      costs.map((c,i) => {
        if (c <= (min + alpha * (max-min))) rcl.push(candidates[i])
        return c
      })
      candidate.vector.push(rcl[randomInteger(rcl.length-1)])
    }
    candidate.cost = cost({ perm: candidate.vector, cities })
    return candidate
  } catch (e) {
    throw new Error(`Construct randomized greedy solution ${e}`)
  }
}

/**
* greedyRandomizedAdaptiveSearch: Primary search function
* @param {Array} cities: 2D array of all available cities
* @param {Number} maxIter: Max iterations
* @param {Number} maxNoImprov: Determines when the search can no longer improve
* @param {Number} alpha: defines the amount of greediness(0 too greedy, 1 to general)
* @returns {Object} best candidate
* @called
**/
const greedyRandomizedAdaptiveSearch = ({ cities, maxIter, maxNoImprov, alpha }) => {
  try {
    let best = null
    for (let i = 0; i < maxIter; i++) {
      let candidate = constructRandomizedGreedySolution({ cities, alpha })
      candidate = localSearch({ best: candidate, cities, maxNoImprov })
      if (best === null || candidate.cost < best.cost) best = candidate
      console.log(`> Iteration: ${i+1}, Best: ${best.cost}`)
    }
    return best
  } catch (e) {
    throw new Error(`Randomized greedy adaptive search: ${e}`)
  }
}

module.exports = { greedyRandomizedAdaptiveSearch }

/* END */
