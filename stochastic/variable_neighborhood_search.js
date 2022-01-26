/*******************************************************************************
Clever Algorithms, pg 57
Variable Neighborhood Search: The strategy for the Variable Neighborhood Search
involves iterative exploration of larger and larger neighborhoods for a given
local optima until an improvement is located after which time the search across
expanding neighborhoods is repeated. The strategy is motivated by
three principles: 1) a local minimum for one neighborhood structure
may not be a local minimum for a different neighborhood structure,
2) a global minimum is a local minimum for all possible neighborhood
structures, and 3) local minima are relatively close to global minima for
many problem classes.
*******************************************************************************/
const { euclid2D, randomPermutation, stochasticTwoOpt } = require('../utils')

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
* localSearch: iterates through neighborhood and returns best candidate of local search
* @param {Object} best: Current candidate solution
* @param {Array} cities: 2D array of all available cities
* @param {Number} maxNoImprov: Determines when the search can no longer improve
* @param {Number} neighborhood: Neighborhood value 1...n
* @returns {Object} best candidate
* @called
**/
const localSearch = ({ best, cities, maxNoImprov, neighborhood }) => {
  try {
    let count = 0
    do {
      let candidate = { vector: [ ...best.vector ] }
      for (let i = 0; i < neighborhood; i++) {
        candidate.vector = stochasticTwoOpt(candidate.vector)
      }
      candidate.cost = cost({ perm: candidate.vector, cities })
      if (candidate.cost < best.cost) {
        count = 0
        best = candidate
      } else count += 1
    } while (count <= maxNoImprov)
    return best
  } catch (e) {
    throw new Error(`Local search: ${e}`)
  }
}

/**
* variableNeighborhoodSearch: Search method to return optimal solution to TSP
* @param {Array} cities: 2D array of all available cities
* @param {Array} neighborhoods: array values 1...n
* @param {Number} maxNoImprov: Determines when the search can no longer improve
* @param {Number} maxNoImprovLs: Determines when the search can no longer improve locally
* @returns {Number} distance of permutation route
* @called
**/
const variableNeighborhoodSearch = ({ cities, neighborhoods, maxNoImprov,
  maxNoImprovLs }) => {
  try {
    let best = { vector: randomPermutation(cities) }
    best.cost = cost({ perm: best.vector, cities })
    let iter = 0
    let count = 0

    do {
      for (let neigh = 1; neigh <= neighborhoods.length; neigh++) {
        let candidate = { vector: [ ...best.vector ] }
        for (let i = 0; i < neigh; i++) {
          candidate.vector = stochasticTwoOpt(candidate.vector)
        }
        candidate.cost = cost({ perm: candidate.vector, cities })
        candidate = localSearch({
          best: candidate,
          cities,
          maxNoImprov: maxNoImprovLs,
          neighborhood: neigh
        })
        console.log(`> Iteration: ${iter+1}, Neigh: ${neigh}, Best: ${best.cost}`)
        iter += 1
        if (candidate.cost < best.cost) {
          best = candidate
          count = 0
          break
        } else count += 1
      }
    } while (count <= maxNoImprov);

    return best
  } catch (e) {
    throw new Error(`Variable neighborhood search: ${e}`)
  }
}

module.exports = { variableNeighborhoodSearch }

/* END */
