/*******************************************************************************
Clever Algorithms, pg 175
Simulated Annealing: The information processing objective of the technique is
to locate the minimum cost configuration in the search space. The algorithms
plan of action is to probabilistically re-sample the problem space where the
acceptance of new samples into the currently held sample is managed
by a probabilistic function that becomes more discerning of the cost
of samples it accepts over the execution time of the algorithm. This
probabilistic decision is based on the Metropolis-Hastings algorithm for
simulating samples from a thermodynamic system.
Problem: TSP
*******************************************************************************/
const { euclid2D, randomPermutation, stochasticTwoOpt } = require('../utils')

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
* createNeighbor: Creates a new neighbor solution to current
* @param {Object} current: Current candidate solution
* @param {Array} cities: 2D array of all available cities
* @returns {Object} new neighbor solution
* @called
**/
const createNeighbor = ({ current, cities }) => {
  try {
    let candidate = { vector: [ ...current.vector ] }
    candidate.vector = stochasticTwoOpt(candidate.vector)
    candidate.cost = cost({ permutation: candidate.vector, cities })
    return candidate
  } catch (e) {
    throw new Error(`Create neighbor: ${e}`)
  }
}
/**
* shouldAccept: Whether a candidate solution should be accepted; based on cost
* @param {Object} candidate solution
* @param {Object} current: Current candidate solution
* @param {Number} temp: temperature of annealing process
* @returns {Boolean} true or false depending on acceptance of new solution
* @called
**/
const shouldAccept = ({ candidate, current, temp }) => {
  try {
    if (candidate.cost <= current.cost) return true
    return Math.exp((current.cost - candidate.cost) / temp) > Math.random()
  } catch (e) {
    throw new Error(`Should accept: ${e}`)
  }
}
/**
* simulatedAnnealingSearch: main search function
* @param {Array} cities: 2D array of all available cities
* @param {Number} maxIter: max iterations
* @param {Number} maxTemp: max temperature of annealing process
* @param {Number} tempChange: factor at which temp changes(increases)
* @returns {Object} best: best solution
* @called
**/
const simulatedAnnealingSearch = ({ cities, maxIter, maxTemp, tempChange }) => {
  try {
    let current = { vector: randomPermutation(cities) }
    current.cost = cost({ permutation: current.vector, cities })
    let temp = maxTemp
    let best = { ...current }
    for (let i = 0; i < maxIter; i++) {
      const candidate = createNeighbor({ current, cities })
      temp = temp * tempChange
      if (shouldAccept({ candidate, current, temp })) current = candidate
      if (candidate.cost < best.cost) best = candidate
      if (i % 10 === 0)
        console.log(`> Iteration: ${i+1}, Temp: ${temp}, Best: ${best.cost}`)
    }
    return best
  } catch (e) {
    throw new Error(`Simulated annealing search: ${e}`)
  }
}

module.exports = { simulatedAnnealingSearch }

/* END */
