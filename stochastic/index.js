/*******************************************************************************
Stoachistic Algorithms
Random Search
Adaptive Random Search
*******************************************************************************/
const { BERLIN_52 } = require('../utils')
const { randomSearch } = require('./random_search')
const { adaptiveRandomSearch } = require('./adaptive_random_search')
const { stochasticHillClimbingSearch } = require('./stochastic_hill_climbing')
const { iteratedLocalSearch } = require('./iterated_local_search')
const { guidedLocalSearch } = require('./guided_local_search')
const { variableNeighborhoodSearch } = require('./variable_neighborhood_search')

module.exports = {
  adaptiveRandomSearch,
  guidedLocalSearch,
  iteratedLocalSearch,
  randomSearch,
  stochasticHillClimbingSearch,
  variableNeighborhoodSearch
}

/* END */
