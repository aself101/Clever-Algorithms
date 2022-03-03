/*******************************************************************************
Clever Algorithms, pg 175
Extremal Optimization: The objective of the information processing strategy is 
to iteratively identify the worst performing components of a given solution and 
replace or swap them with other components. This is achieved through the allocation 
of cost to the components of the solution based on their contribution to the 
overall cost of the solution in the problem domain. Once components are assessed 
they can be ranked and the weaker components replaced or switched with a randomly 
selected component.
Problem: TSP
*******************************************************************************/
const { euclid2D, randomPermutation } = require('../utils')

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
* calculateNeighborRank: calculates the neighbor cities rank(distance)
* @param {Number} cityNumber: index of a city
* @param {Array} cities: array of all available cities(indexes)
* @param {Array} ignore: city routes to ignore
* @returns {Array}: neighbors: sorted by distance 
* @called
**/
const calculateNeighborRank = ({ cityNumber, cities, ignore=[] }) => {
  try {
    let neighbors = []
    cities.map((city, i) => {
      if (i === cityNumber || ignore.includes(i)) return city
      let neighbor = { 
        number: i,
        distance: euclid2D({ c1: cities[cityNumber], c2: city }) 
      }
      neighbors.push(neighbor)
      return city
    })
    return neighbors.sort((a,b) => a.distance > b.distance ? -1 : 1)
  } catch (e) {
    throw new Error(`Calculate neighbor rank: ${e}`)
  }
}
/**
* getEdgesForCity: Returns the edges for a selected city
* @param {Number} cityNumber: index of a city
* @param {Array} permutation: random permutation of routes
* @returns {Array}: [c1,c2]: two edges from a particular city
* @called
**/
const getEdgesForCity = ({ cityNumber, permutation }) => {
  try {
    let c1 = null
    let c2 = null
    permutation.map((c,i) => {
      if (c === cityNumber) {
        c1 = (i === 0) ? permutation[permutation.length-1] : permutation[i-1]
        c2 = (i === permutation.length-1) ? permutation[0] : permutation[i+1]
        return c
      }
      return c
    })
    return [c1, c2]
  } catch (e) {
    throw new Error(`Get edges for city: ${e}`)
  }
}
/**
* calculateCityFitness: calculates the fitness of the city route
* @param {Array} permutation: random permutation of routes
* @param {Number} cityNumber: index of a city
* @param {Array} cities: array of all available cities(indexes)
* @returns {Number}: fitness of a city route
* @called
**/
const calculateCityFitness = ({ permutation, cityNumber, cities }) => {
  try {
    let [c1, c2] = getEdgesForCity({ cityNumber, permutation })
    let neighbors = calculateNeighborRank({ cityNumber, cities })
    let n1 = -1
    let n2 = -1
    for (let i = 0; i < neighbors.length; i++) {
      if (neighbors[i].number === c1) n1 = i + 1
      if (neighbors[i].number === c2) n2 = i + 1
      if (n1 !== -1 && n2 !== -1) break
    }
    return 3.0 / (n1 + n2)
  } catch (e) {
    throw new Error(`Calculate city fitness: ${e}`)
  }
}
/**
* calculateCityFitnesses: calculates the fitness of all city routes
* @param {Array} cities: array of all available cities(indexes)
* @param {Array} permutation: random permutation of routes
* @returns {Array}: fitnesss of city routes
* @called
**/
const calculateCityFitnesses = ({ cities, permutation }) => {
  try {
    let cityFitnesses = []
    cities.map((city, i) => {
      let cityFitness = {
        number: i,
        fitness: calculateCityFitness({ 
          permutation, 
          cityNumber: i, 
          cities 
        })
      }
      cityFitnesses.push(cityFitness)
      return city
    })
    return cityFitnesses.sort((a,b) => a.fitness > b.fitness ? -1 : 1)
  } catch (e) {
    throw new Error(`Calculate city fitnesses: ${e}`)
  }
}
/**
* calculateComponentProbabilities: Likelihood a city will be selected
* @param {Array} orderedComponents: components ordered by fitness(or distance?)
* @param {Number} tau: determines the selection of the worse component
* @returns {Number}: sum
* @called
**/
const calculateComponentProbabilities = ({ orderedComponents, tau }) => {
  try {
    return orderedComponents.reduce((acc, component, i) => {
      component.prob = Math.pow(i + 1.0, -tau)
      return acc + component.prob
    }, 0)
  } catch (e) {
    throw new Error(`Calculate component probabilities: ${e}`)
  }
}
/**
* makeSelection: Makes a selection of a component to be removed
* @param {Array} components: components ordered by fitness(or distance?)
* @param {Number} sumProbability: probability of a component being selected
* @returns {Number}: number(index) of the component
* @called
**/
const makeSelection = ({ components, sumProbability }) => {
  try {
    let selection = Math.random()
    for (let i = 0; i < components.length; i++) {
      selection -= (components[i].prob / sumProbability)
      if (selection <= 0) return components[i].number
    }
    return components[components.length-1].number
  } catch (e) {
    throw new Error(`Make selection: ${e}`)
  }
}
/**
* probabilisticSelection: probabilistically selects a city
* @param {Array} orderedComponents: components ordered by fitness(or distance?)
* @param {Number} tau: determines the selection of the worse component
* @param {Array} exclude: cities to exclude from selection
* @returns {Object} selectedCity
* @called
**/
const probabilisticSelection = ({ orderedComponents, tau, exclude=[] }) => {
  try {
    const sum = calculateComponentProbabilities({
      orderedComponents,
      tau
    })
    let selectedCity = null
    do {
      selectedCity = makeSelection({ 
        components: orderedComponents, 
        sumProbability: sum 
      })
    } while (exclude.includes(selectedCity)) 
    return selectedCity
  } catch (e) {
    throw new Error(`Probilistic selection: ${e}`)
  }
}
/**
* varyPermuation: creates new permutations of the city routes(shakes it up)
* @param {Array} permutation: random permutation of routes
* @param {Number} selected: selected city index
* @param {Number} newIndex: new selected city index
* @param {Number} longEdge: longest edge from one city to another
* @returns {Array} perm: new city routes permutation
* @called
**/
const varyPermuation = ({ permutation, selected, newIndex, longEdge }) => {
  try {
    let perm = [ ...permutation ]
    let c1 = perm[selected-1]
    let c2 = perm[newIndex-1]
    let [p1, p2] = (c1 < c2) ? [c1, c2] : [c2, c1]
    let right = (c1 === perm.length-1) ? 0 : c1 + 1
    if (perm[right] === longEdge) {
      perm = [
        ...perm.slice(0,p1+1),
        ...perm.slice(p1+1, p2).reverse(),
        ...perm.slice(p2, perm.length)
      ]
    } else {
      perm = [
        ...perm.slice(0,p1),
        ...perm.slice(p1, p2).reverse(),
        ...perm.slice(p2, perm.length)
      ]
    }
    return perm
  } catch (e) {
    throw new Error(`Vary permutation: ${e}`)
  }
}
/**
* getLongEdges: gets the longest edges between neighbors
* @param {Array} edges: edges between neighbors
* @param {Array} neighborDistances: distances between neighbors
* @returns {Number} long edge
* @called
**/
const getLongEdges = ({ edges, neighborDistances }) => {
  try {
    let n1 = neighborDistances.find((x) => x.number === edges[0])
    let n2 = neighborDistances.find((x) => x.number === edges[1])
    return (n1.distance > n2.distance) ? n1.number : n2.number
  } catch (e) {
    throw new Error(`Get long edges: ${e}`)
  }
}
/**
* createNewPerm: creates a new permutation of routes
* @param {Array} cities: array of all available cities(indexes)
* @param {Number} tau: determines the selection of the worse component
* @param {Array} perm: random permutation of routes
* @returns {Array} permutation
* @called
**/
const createNewPerm = ({ cities, tau, perm }) => {
  try {
    let cityFitnesses = calculateCityFitnesses({ cities, permutation: perm })
    let selectedCity = probabilisticSelection({ 
      orderedComponents: cityFitnesses.reverse(),
      tau
    })
    let edges = getEdgesForCity({ 
      cityNumber: selectedCity, 
      permutation: perm 
    })
    let neighbors = calculateNeighborRank({ 
      cityNumber: selectedCity, 
      cities 
    })
    let newNeighbor = probabilisticSelection({
      orderedComponents: neighbors,
      tau,
      exclude: edges
    })
    let longEdge = getLongEdges({ 
      edges, 
      neighborDistances: neighbors 
    })
    return varyPermuation({
      permutation: perm,
      selected: selectedCity,
      newIndex: newNeighbor,
      longEdge
    })
  } catch (e) {
    throw new Error(`Create new perm: ${e}`)
  }
}
/**
* extremalOptimizationSearch: main search function
* @param {Array} cities: array of all available cities(indexes)
* @param {Number} maxIter: max iterations
* @param {Number} tau: determines the selection of the worse component
* @returns {Object} best
* @called
**/
const extremalOptimizationSearch = ({ cities, maxIter, tau }) => {
  try {
    let current = { vector: randomPermutation(cities) }
    current.cost = cost({ permutation: current.vector, cities })
    let best = current
    for (let i = 0; i < maxIter; i++) {
      let candidate = { 
        vector: createNewPerm({
          cities,
          tau,
          perm: current.vector
        }) 
      }
      candidate.cost = cost({ permutation: candidate.vector, cities })
      current = candidate
      if (candidate.cost < best.cost) best = candidate
      console.log(`> Iter: ${i+1}, Curr: ${current.cost}, Best: ${best.cost}`)
    }
    return best
  } catch (e) {
    throw new Error(`Extremal optimization search: ${e}`)
  }
}

module.exports = { extremalOptimizationSearch }

/* END */