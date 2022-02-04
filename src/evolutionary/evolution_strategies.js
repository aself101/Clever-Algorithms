/*******************************************************************************
Clever Algorithms, pg 113
Evolution Strategies: The objective of the Evolution Strategies algorithm is
to maximize the suitability of collection of candidate solutions in the context
of an objective function from a domain. The objective was classically achieved
through the adoption of dynamic variation, a surrogate for descent with
modification, where the amount of variation was adapted dynamically
with performance-based heuristics. Contemporary approaches co-adapt
parameters that control the amount and bias of variation with the
candidate solutions.
Problem: Continuous function optimization; minimizing a cost function
*******************************************************************************/
const { objectiveFunction, randomVector, randomGaussian } = require('../utils')

/**
* mutateProblem: mutates a child vector solution within the bounds of the searchSpace
* @param {Array} vector: vector solution
* @param {Array} stdevs: standard deviations
* @param {Array} searchSpace: problem bounds
* @returns {Array} mutated child array
* @called
**/
const mutateProblem = ({ vector, stdevs, searchSpace }) => {
  try {
    return vector.map((v,i) => {
      let child = v + stdevs[i] * randomGaussian()
      if (child < searchSpace[i][0]) child = searchSpace[i][0]
      if (child > searchSpace[i][1]) child = searchSpace[i][1]
      return child
    })
  } catch (e) {
    throw new Error(`Mutate problem: ${e}`)
  }
}

/**
* mutateStrategy: mutates the strategy of the stdevs
* @param {Array} stdevs: standard deviations
* @returns {Array} new strategy solution
* @called
**/
const mutateStrategy = (stdevs) => {
  try {
    let tau = Math.pow(Math.sqrt(2.0 * stdevs.length), -1.0)
    let tauP = Math.pow(Math.sqrt(2.0 * Math.sqrt(stdevs.length)), -1.0)
    return new Array(stdevs.length).fill(0).map((a,i) => {
      return stdevs[i] * Math.exp(tauP * randomGaussian() + tau * randomGaussian())
    })
  } catch (e) {
    throw new Error(`Mutate strategy: ${e}`)
  }
}

/**
* mutate: mutates a child within the population
* @param {Object} par: member of the population
* @returns {Array} minmax: bounds of the problem domain
* @called
**/
const mutate = ({ par, minmax }) => {
  try {
    return {
      vector: mutateProblem({
        vector: par.vector,
        stdevs: par.strategy,
        searchSpace: minmax
      }),
      strategy: mutateStrategy(par.strategy)
    }
  } catch (e) {
    throw new Error(`Mutate: ${e}`)
  }
}

/**
* initPopulation: initialize a new population of candidate solutions
* @param {Array} minmax: bounds of the problem domain
* @param {Number} popSize: population size
* @returns {Array} pop: new population
* @called
**/
const initPopulation = ({ minmax, popSize }) => {
  try {
    let strategy = new Array(minmax.length).fill(0).map((a,i) => {
      return [0, (minmax[i][1] - minmax[i][0]) * 0.05]
    })
    return new Array(popSize).fill({}).map((a,i) => {
      return {
        vector: randomVector(minmax),
        strategy: randomVector(strategy)
      }
    }).map((a,i) => { return { ...a, fitness: objectiveFunction(a.vector) } })
  } catch (e) {
    throw new Error(`Init population: ${e}`)
  }
}

/**
* evolutionaryStrategySearch: main search function
* @param {Number} maxGens: maximum generations
* @param {Array} searchSpace: Search space of the problem domain
* @param {Number} popSize: population size
* @param {Number} numChildren: number of possible children solutions
* @returns {Object} best: best solution found
* @called
**/
const evolutionaryStrategySearch = ({ maxGens, searchSpace, popSize,
  numChildren }) => {
  try {
    let population = initPopulation({ minmax: searchSpace, popSize })
    let best = population.sort((a,b) => a.fitness < b.fitness ? -1 : 1)[0]

    for (let gen = 0; gen < maxGens; gen++) {
      const children = new Array(numChildren).fill({}).map((a,i) => {
        return mutate({ par: population[i], minmax: searchSpace })
      }).map((a,i) => { return { ...a, fitness: objectiveFunction(a.vector) } })

      let union = [...children, ...population].sort((a,b) => a.fitness < b.fitness ? -1 : 1)
      if (union[0].fitness < best.fitness) best = union[0]
      population = union.slice(0, popSize)
      console.log(`> Generation: ${gen}, Fitness: ${best.fitness}`)
    }

    return best
  } catch (e) {
    throw new Error(`Evolutionary strategy search: ${e}`)
  }
}

module.exports = { evolutionaryStrategySearch }

/* END */
