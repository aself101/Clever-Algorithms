/*******************************************************************************
Clever Algorithms, pg 96
Genetic Algorithm: The objective of the Genetic Algorithm is to maximize
the payoff of candidate solutions in the population against a cost function
from the problem domain. The strategy for the Genetic Algorithm is to repeatedly
employ surrogates for the recombination and mutation genetic mecha-
nisms on the population of candidate solutions, where the cost function
(also known as objective or fitness function) applied to a decoded repre-
sentation of a candidate governs the probabilistic contributions a given
candidate solution can make to the subsequent generation of candidate
solutions.
Problem: Binary string optimization; maximization problem
*******************************************************************************/
const { oneMax, randomBitstring, randomInteger,
  binaryTournament } = require('../utils')

/**
* pointMutation: randomly mutates 1 or more bits in a bitstring
* @param {Array} bitstring: Individual in a population
* @param {Number} rate: Mutation rate(% chance) 1/length of bitstring
* @returns {Array} mutated solution
**/
const pointMutation = ({ bitstring, rate=1.0/bitstring.length }) => {
  try {
    return bitstring.map((bit,i) => {
      if (Math.random() < rate) {
        if (bit === '1') return '0'
        return '1'
      }
      return bit
    })
  } catch (e) {
    throw new Error(`Point mutation: ${e}`)
  }
}

/**
* crossover: Crosses two parents at a randomly selected spot if randomly selected
* @param {Array} parent1: bitstring solution
* @param {Array} parent2: bitstring solution
* @param {Number} rate: Mutation rate(% chance) 1/length of bitstring
* @returns {Array} crossed solution or parents1
**/
const crossover = ({ parent1, parent2, rate }) => {
  try {
    if (Math.random() >= rate) return parent1
    let point = 1 + randomInteger(parent1.length - 2)
    return [ ...parent1.slice(0, point), ...parent2.slice(point, parent1.length) ]
  } catch (e) {
    throw new Error(`Crossover: ${e}`)
  }
}

/**
* reproduce: selects two random parents from a selection of the population to
  create a new children solutions
* @param {Array} selected: selected solutions within a population
* @param {Array} popSize: size of population
* @param {Number} pCross: Crossover rate(% chance) of a crossover
* @param {Number} pMutation: Mutation rate(% chance) 1/length of bitstring
* @returns {Array} possible new solution
**/
const reproduce = ({ selected, popSize, pCross, pMutation }) => {
  try {
    let children = []
    for (let i = 0; i < selected.length; i++) {
      let p2 = (i % 2 === 0) ? selected[i+1] : selected[i-1]
      if (i === selected.length - 1) p2 = selected[0]
      let child = {
        bitstring: crossover({
          parent1: selected[i].bitstring,
          parent2: p2.bitstring,
          rate: pCross
        })
      }
      child.bitstring = pointMutation({
        bitstring: child.bitstring,
        rate: pMutation
      })
      children.push(child)
      if (children.length >= popSize) break
    }
    return children
  } catch (e) {
    throw new Error(`Reproduce: ${e}`)
  }
}

/**
* geneticAlgorithmSearch: main search function
* @param {Array} maxGens: maximum generations
* @param {Number} numBits: number of bits per individual
* @param {Number} popSize: population size
* @param {Number} pCrossover: probability of a crossover
* @param {Number} pMutation: probability of a mutation
* @returns {Object} best: best solution found
* @called
**/
const geneticAlgorithmSearch = ({ maxGens, numBits, popSize, pCrossover,
  pMutation }) => {
  try {
    let population = new Array(popSize).fill({}).map((c,i) => {
      return { bitstring: randomBitstring(numBits) }
    }).map((c,i) => {
      return { ...c, fitness: oneMax(c.bitstring) }
    })
    let best = population.sort((a,b) => a.fitness < b.fitness ? 1 : -1)[0]

    for (let i = 0; i < maxGens; i++) {
      let selected = new Array(popSize).fill({}).map((c,i) => binaryTournament(population))
      let children = reproduce({ selected, popSize, pCross: pCrossover, pMutation })
      children = children.map((c,i) => {
        return { ...c, fitness: oneMax(c.bitstring) }
      }).sort((a,b) => a.fitness < b.fitness ? 1 : -1)
      if (children[0].fitness >= best.fitness) best = children[0]
      population = [ ...children ]
      console.log(`Generation: ${i+1}, Best: ${best.fitness}, ${best.bitstring.join('')}`)
      if (best.fitness === numBits) {
        best.generation = (i+1 === undefined) ? i : i+1
        break
      }
    }
    if (best.generation === undefined) best.generation = maxGens-1
    return best
  } catch (e) {
    throw new Error(`GA search: ${e}`)
  }
}

module.exports = { geneticAlgorithmSearch }

/* END */
