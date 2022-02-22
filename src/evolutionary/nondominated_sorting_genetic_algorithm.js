/*******************************************************************************
Clever Algorithms, pg 157
Non-Dominated Sorted Genetic Algorithm: The objective of the NSGA algorithm is
to improve the adaptive fit of a population of candidate solutions to a Pareto
front constrained by a set of objective functions. The algorithm uses an
evolutionary process with surrogates for evolutionary operators including
selection, genetic crossover, and genetic mutation. The population is sorted
into a hierarchy of sub-populations based on the ordering of Pareto dominance.
Similarity between members of each sub-group is evaluated on the
Pareto front, and the resulting groups and similarity measures are used
to promote a diverse front of non-dominated solutions.
Problem: Multiple function optimization
*******************************************************************************/
const { objectiveFunction, objectiveFunction2,
  randomBitstring, pointMutation, randomInteger } = require('../utils')

/**
* decode: decodes the value of the bitstring to the function domain
* @param {Array} bitstring: bitstring solution
* @param {Array} searchSpace: problem domain
* @param {Number} bitsPerParam: bits per parameter
* @returns {Array} decoded bitstring vector
**/
const decode = ({ bitstring, searchSpace, bitsPerParam }) => {
  try {
    let vector = []
    searchSpace.map((bounds, i) => {
      let off = i * bitsPerParam
      let sum = 0
      let param = bitstring.slice(off, (off+bitsPerParam)).reverse()

      for (let j = 0; j < param.length; j++) {
        sum += ((param[j] === '1') ? 1.0 : 0) * (Math.pow(2.0, j))
      }
      let [min,max] = bounds
      vector.push(min + ((max-min) / (Math.pow(2.0, bitsPerParam) - 1.0)) * sum)
      return bounds
    })
    return vector
  } catch (e) {
    throw new Error(`Decode: ${e}`)
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
    return parent1.map((bit, i) => {
      if (Math.random() < 0.5) return bit
      return parent2[i]
    })
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
* @returns {Array} possible new solution
**/
const reproduce = ({ selected, popSize, pCross }) => {
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
      child.bitstring = pointMutation({ bitstring: child.bitstring })
      children.push(child)
      if (children.length >= popSize) break
    }
    return children
  } catch (e) {
    throw new Error(`Reproduce: ${e}`)
  }
}
/**
* calculateObjectives: calculates the objective functions for each individual in pop
* @param {Array} pop: population of candidate solutions
* @param {Array} searchSpace: problem domain
* @param {Number} bitsPerParam: bits per parameter
* @returns {Array} pop
**/
const calculateObjectives = ({ pop, searchSpace, bitsPerParam }) => {
  try {
    return pop.map((p) => {
      let vector = decode({ bitstring: p.bitstring, searchSpace, bitsPerParam })
      return { ...p,
        vector,
        objectives: [objectiveFunction(vector), objectiveFunction2(vector)]
      }
    })
  } catch (e) {
    throw new Error(`Calculate objectives: ${e}`)
  }
}
/**
* dominates: Determines if one parent dominates another from objectiveFunction vals
* @param {Array} parent1: bitstring solution
* @param {Array} parent2: bitstring solution
* @returns {Boolean} true or false if p1 domiantes p2
**/
const dominates = ({ p1, p2 }) => {
  try {
    for (let i = 0; i < p1.objectives.length; i++) {
      if (p1.objectives[i] > p2.objectives[i]) return false
    }
    return true
  } catch (e) {
    throw new Error(`Dominates: ${e}`)
  }
}
/**
* fastNonDominatedSort: Sorts population based on domination
* @param {Array} pop: population of candidate solutions
* @returns {Array} pareto fronts
**/
const fastNonDominatedSort = (pop) => {
  try {
    let fronts = new Array(1).fill([])
    for (let p1 of pop) {
      p1.domCount = 0
      p1.domSet = []
      for (let p2 of pop) {
        if (dominates({ p1, p2 })) p1.domSet.push(p2)
        else if (dominates({ p1: p2, p2: p1 })) p1.domCount += 1
      }
      if (p1.domCount === 0) {
        p1.rank = 0
        fronts[0].push(p1)
      }
    }
    let curr = 0
    do {
      let nextFront = []
      fronts[curr].map((p1) => {
        for (let p2 of p1.domSet) {
          p2.domCount -= 1
          if (p2.domCount === 0) {
            p2.rank = (curr + 1)
            nextFront.push(p2)
          }
        }
        return p1
      })
      curr += 1
      if (nextFront.length > 0) fronts.push(nextFront)
    } while (curr < fronts.length)

    return fronts
  } catch (e) {
    throw new Error(`Fast dominated sort: ${e}`)
  }
}
/**
* calculateCrowdingDistance: calculates the distance between individual members
  of the population using the objective values
* @param {Array} pop: population of candidate solutions
* @returns {Array} pop
**/
const calculateCrowdingDistance = (pop) => {
  try {
    for (let p of pop) p.dist = 0
    let numObs = pop[0].objectives.length
    for (let i = 0; i < numObs; i++) {
      let min = Math.min(...pop.map((p) => p.objectives[i]))
      let max = Math.max(...pop.map((p) => p.objectives[i]))
      let range = max - min
      pop[0].dist = 1.0/0.0
      pop[pop.length-1].dist = 1.0/0.0
      if (range === 0) continue
      else {
        for (let j = 1; j < pop.length - 1; j++) {
          pop[j].dist += (pop[j+1].objectives[i] - pop[j-1].objectives[i]) / range
        }
      }
    }
    return pop
  } catch (e) {
    throw new Error(`Calculate crowding distance: ${e}`)
  }
}
/**
* crowdedComparisonOperator: sorting function
* @param {Array} pop: population of candidate solutions
* @returns {Boolean} true or false depending on dist and rank
**/
const crowdedComparisonOperator = (x, y) => {
  try {
    if (x.rank === y.rank) {
      if (x.dist < y.dist) return -1
      else if (x.dist > y.dist) return 1
      return 0
    }
    if (x.rank < y.rank) return -1
    if (x.rank > y.rank) return 1
    return 0
  } catch (e) {
    throw new Error(`Crowded comparison operator: ${e}`)
  }
}
/**
* better: determines which solution is best by rank and distance
* @param {Array} pop: population of candidate solutions
* @returns {Array} pop
**/
const better = ({ x, y }) => {
  try {
    if (x.dist !== null && x.rank === y.rank) return (x.dist > y.dist) ? x : y
    return (x.rank < y.rank) ? x : y
  } catch (e) {
    throw new Error(`Better: ${e}`)
  }
}
/**
* selectParents: selects parents from population of fronts
* @param {Array} fronts: population of candidate solutions
* @param {Number} popSize: population size
* @returns {Array} pop
**/
const selectParents = ({ fronts, popSize }) => {
  try {
    for (let f of fronts) f = calculateCrowdingDistance(f)
    let offspring = []
    let lastFront = 0
    for (let front of fronts) {
      if (offspring.length + front.length > popSize) break
      for (let p of front) offspring.push(p)
      lastFront += 1
    }
    let remaining = popSize - offspring.length
    if (remaining > 0) {
      fronts[lastFront] = fronts[lastFront].sort(crowdedComparisonOperator)
      for (let p of fronts[lastFront].slice(0,remaining)) offspring.push(p)
    }
    return offspring
  } catch (e) {
    throw new Error(`Select parents: ${e}`)
  }
}
/**
* weightedSum: simple sum function
* @param {Object} x: candidate solution
* @returns {Number} sum
**/
const weightedSum = (x) => {
  try {
    return x.objectives.reduce((acc, cur) => { return acc + cur }, 0)
  } catch (e) {
    throw new Error(`Weighted sum: ${e}`)
  }
}
/**
* nonDominatedGASearch: Main search function
* @param {Array} searchSpace: search domain
* @param {Number} maxGens: max generations
* @param {Number} popSize: population size
* @param {Number} pCross: crossover probability
* @param {Number} bitsPerParam
* @returns {Array} parents
**/
const nonDominatedGASearch = ({ searchSpace, maxGens, popSize, pCross,
  bitsPerParam=16 }) => {
  try {
    let pop = new Array(popSize).fill({}).map((p,i) => {
      return {
        bitstring: randomBitstring(searchSpace.length * bitsPerParam)
      }
    })
    pop = calculateObjectives({ pop, searchSpace, bitsPerParam })
    fastNonDominatedSort(pop)
    let selected = new Array(popSize).fill({}).map((p,i) => {
      return better({ x: pop[randomInteger(popSize-1)], y: pop[randomInteger(popSize-1)] })
    })
    let children = reproduce({ selected, popSize, pCross })
    children = calculateObjectives({ pop: children, searchSpace, bitsPerParam })

    for (let gen = 0; gen < maxGens; gen++) {
      let union = [ ...pop, ...children ]
      let fronts = fastNonDominatedSort(union)
      let parents = selectParents({ fronts, popSize })
      selected = new Array(popSize).fill({}).map((p,i) => {
        return better({ x: parents[randomInteger(popSize-1)], y: parents[randomInteger(popSize-1)] })
      })
      pop = children
      children = reproduce({ selected, popSize, pCross })
      children = calculateObjectives({ pop: children, searchSpace, bitsPerParam })

      let best = parents.sort((a,b) => weightedSum(a) < weightedSum(b) ? -1 : 1)[0]
      let bestSolution = `[x: ${best.vector}, Objectives: ${best.objectives.join(',')}]`
      console.log(`> Gen: ${gen+1}, Fronts: ${fronts.length}, Best: ${bestSolution}`)
    }
    let union = [ ...pop, ...children ]
    let fronts = fastNonDominatedSort(union)
    let parents = selectParents({ fronts, popSize })

    return parents
  } catch (e) {
    throw new Error(`Non-dominated genetic algorithm search: ${e}`)
  }
}

module.exports = { nonDominatedGASearch }

/* END */
