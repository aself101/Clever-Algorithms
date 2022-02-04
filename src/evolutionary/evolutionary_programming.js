/*******************************************************************************
Clever Algorithms, pg 125
Evolutionary Programming: The objective of the Evolutionary Programming
algorithm is to maximize the suitability of a collection of candidate solutions
in the context of an objective function from the domain. This objective is
pursued by using an adaptive model with surrogates for the processes of evolution,
specifically hereditary (reproduction with variation) under competition.
The representation used for candidate solutions is directly assessable by
a cost or objective function from the domain.
Problem: Continuous function optimization; minimizing a cost function
*******************************************************************************/
const { objectiveFunction, randomVector, randomGaussian,
  randomInteger } = require('../utils')

/**
* mutate: mutates a candidate solution to create a new child
* @param {Object} candidate: current best candidate
* @param {Array} searchSpace: problem bounds
* @returns {Object} child: new candidate solution
**/
const mutate = ({ candidate, searchSpace }) => {
  try {
    let child = { vector: [], strategy: [] }
    candidate.vector.map((vOld, i) => {
      const sOld = candidate.strategy[i]
      let v = vOld + sOld * randomGaussian()
      if (v < searchSpace[i][0]) v = searchSpace[i][0]
      if (v > searchSpace[i][1]) v = searchSpace[i][1]
      child.vector.push(v)
      child.strategy.push(sOld + randomGaussian() * Math.pow(sOld,0.5))
      return vOld
    })
    return child
  } catch (e) {
    throw new Error(`Mutate: ${e}`)
  }
}

/**
* tournament: holds a tournament between a candidate solution and random members
  of the population; wins are tallied based on the fitness of the candidate
* @param {Object} candidate: current best candidate
* @param {Array} population: all candidate solutions
* @param {Number} boutSize: Number of bouts between candidate and population
* @returns
**/
const tournament = ({ candidate, population, boutSize }) => {
  try {
    candidate.wins = 0
    for (let i = 0; i < boutSize; i++) {
      let other = population[randomInteger(population.length-1)]
      if (candidate.fitness < other.fitness) candidate.wins += 1
    }
    return
  } catch (e) {
    throw new Error(`Tournament: ${e}`)
  }
}

/**
* initPopulation: initializes a new population of candidate solutions
* @param {Array} minmax: search space problem bounds
* @param {Number} popSize: Size of the population
* @returns {Array} pop: new population of solutions
**/
const initPopulation = ({ minmax, popSize }) => {
  try {
    let strategy = new Array(minmax.length).fill(0).map((a,i) => {
      return [0, (minmax[i][1] - minmax[i][0]) * 0.05]
    })
    return new Array(popSize).fill({}).map((c,i) => {
      return {
        vector: randomVector(minmax),
        strategy: randomVector(strategy)
      }
    }).map((c,i) => { return { ...c, fitness: objectiveFunction(c.vector) } })
  } catch (e) {
    throw new Error(`Init population: ${e}`)
  }
}

/**
* evolutionaryStrategySearch: main search function
* @param {Number} maxGens: max generations
* @param {Array} searchSpace: search space problem bounds
* @param {Number} popSize: Size of the population
* @param {Number} boutSize: Number of bouts between candidate and population
* @returns {Array} pop: new population of solutions
**/
const evolutionaryProgrammingSearch = ({ maxGens, searchSpace, popSize,
  boutSize }) => {
  try {
    let population = initPopulation({ minmax: searchSpace, popSize })
    let best = population.sort((a,b) => a < b ? -1 : 1)[0]

    for (let gen = 0; gen < maxGens; gen++) {
      let children = new Array(popSize).fill({}).map((c,i) => {
        return mutate({ candidate: population[i], searchSpace })
      }).map((c,i) => { return { ...c, fitness: objectiveFunction(c.vector) } })
        .sort((a,b) => a < b ? -1 : 1)
      if (children[0].fitness < best.fitness) best = children[0]
      let union = [ ...children, ...population ].map((c,i) => {
        tournament({ candidate: c, population, boutSize })
        return c
      }).sort((a,b) => a.wins < b.wins ? 1 : -1)
      population = union.slice(0, popSize)
      console.log(`> Generation: ${gen+1}, Best: ${best.fitness}`)
    }
    return best
  } catch (e) {
    throw new Error(`Evolutionary programming search: ${e}`)
  }
}

module.exports = { evolutionaryProgrammingSearch }



/* END */
