/*******************************************************************************
Clever Algorithms, pg 119
Differential Evolution: The Differential Evolution algorithm involves
maintaining a population of candidate solutions subjected to iterations of
recombination, evaluation, and selection. The recombination approach involves
the creation of new candidate solution components based on the weighted
difference between two randomly selected population members added to a third
population member. This perturbs population members relative to the spread of
the broader population. In conjunction with selection, the perturbation
effect self-organizes the sampling of the problem space, bounding it to
known areas of interest.
Problem: Continuous function optimization; minimizing a cost function
*******************************************************************************/
const { objectiveFunction, randomVector, randomInteger } = require('../utils')

/**
* deRand1Bin: creates a new sample of candidate solutions
* @param {Object} p0: parent solution 1
* @param {Object} p1: parent solution 2
* @param {Object} p2: parent solution 3
* @param {Object} p3: parent solution 4
* @param {Number} f: weighting factor
* @param {Number} cr: crossover weight
* @param {Array} searchSpace: problem bounds
* @returns {Array} new recombined child array
* @called
**/
const deRand1Bin = ({ p0, p1, p2, p3, f, cr, searchSpace }) => {
  try {
    let sample = { vector: new Array(p0.vector.length).fill(0) }
    let cut = randomInteger(sample.vector.length - 1) + 1
    return {
      vector: sample.vector.map((v,i) => {
        v = p0.vector[i]
        if (i === cut || Math.random() < cr) {
          v = p3.vector[i] + f * (p1.vector[i] - p2.vector[i])
          if (v < searchSpace[i][0]) v = searchSpace[i][0]
          if (v > searchSpace[i][1]) v = searchSpace[i][1]
        }
        return v
      })
    }
  } catch (e) {
    throw new Error(`Differential evolution random 1 bin: ${e}`)
  }
}

/**
* selectParents: selects three random parents
* @param {Array} pop: population of candidate solutions
* @param {Object} current: current candidate solution
* @returns {Array} three new random parent indexes
* @called
**/
const selectParents = ({ pop, current }) => {
  try {
    let p1 = randomInteger(pop.length-1)
    let p2 = randomInteger(pop.length-1)
    let p3 = randomInteger(pop.length-1)
    while (p1 === current) p1 = randomInteger(pop.length-1)
    while (p2 === current && p2 === p1) p2 = randomInteger(pop.length-1)
    while (p3 === current && p3 === p1 && p3 === p2) p3 = randomInteger(pop.length-1)
    return [p1, p2, p3]
  } catch (e) {
    throw new Error(`Select parents: ${e}`)
  }
}

/**
* createChildren: creates a new set of candidate child solutions
* @param {Array} pop: population of candidate solutions
* @param {Array} minmax: problem bounds
* @param {Number} f: weighting factor
* @param {Number} cr: crossover weight
* @returns {Array} new randomized child solutions
* @called
**/
const createChildren = ({ pop, minmax, f, cr }) => {
  try {
    return pop.map((p0,i) => {
      let [p1, p2, p3] = selectParents({ pop, current: i })
      return deRand1Bin({
        p0,
        p1: pop[p1],
        p2: pop[p2],
        p3: pop[p3],
        f,
        cr,
        searchSpace: minmax
      })
    })
  } catch (e) {
    throw new Error(`Create children: ${e}`)
  }
}

/**
* selectPopulation: Selects a new optimal population of candidate solutions
* @param {Array} parents: parent solutions
* @param {Array} children: child solutions
* @returns {Array} new fittest population
* @called
**/
const selectPopulation = ({ parents, children }) => {
  try {
    return new Array(parents.length).fill({}).map((p,i) => {
      if (children[i].cost <= parents[i].cost) return children[i]
      return parents[i]
    })
  } catch (e) {
    throw new Error(`Select population: ${e}`)
  }
}

/**
* differentialEvolutionSearch: main search function
* @param {Number} maxGens: max generations
* @param {Array} searchSpace: problem bounds
* @param {Number} popSize: max population size
* @param {Number} f: weighting factor
* @param {Number} cr: crossover weight
* @returns {Object} best candidate solution
* @called
**/
const differentialEvolutionSearch = ({ maxGens, searchSpace, popSize, f, cr }) => {
  try {
    let pop = new Array(popSize).fill({}).map((c,i) => {
      return { vector: randomVector(searchSpace) }
    }).map((c,i) => { return { ...c, cost: objectiveFunction(c.vector) } })
    let best = pop.sort((a,b) => a.cost < b.cost ? -1 : 1)[0]

    for (let gen = 0; gen < maxGens; gen++) {
      let children = createChildren({ pop, minmax: searchSpace, f, cr })
      children = children.map((c,i) => {
        return { ...c, cost: objectiveFunction(c.vector) }
      })
      pop = selectPopulation({ parents: pop, children })
      pop = pop.sort((a,b) => a.cost < b.cost ? -1 : 1)
      if (pop[0].cost < best.cost) best = pop[0]
      console.log(`> Generation: ${gen}, Fitness: ${best.cost}`)
    }
    return best
  } catch (e) {
    throw new Error(`Differential evolution search: ${e}`)
  }
}

module.exports = { differentialEvolutionSearch }

/* END */
