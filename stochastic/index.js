/*******************************************************************************
** Stoachistic Algorithms **
Random Search
Adaptive Random Search
Stochastic Hill Climbing Search
Iterated Local Search
Guided Local Search
Variable Neighborhood Search
Greedy Randomized Adaptive Search
*******************************************************************************/
const { randomSearch } = require('./random_search')
const { adaptiveRandomSearch } = require('./adaptive_random_search')
const { stochasticHillClimbingSearch } = require('./stochastic_hill_climbing')
const { iteratedLocalSearch } = require('./iterated_local_search')
const { guidedLocalSearch } = require('./guided_local_search')
const { variableNeighborhoodSearch } = require('./variable_neighborhood_search')
const { greedyRandomizedAdaptiveSearch } = require('./greedy_randomized_adaptive_search')
const { scatterSearch } = require('./scatter_search')

module.exports = {
  adaptiveRandomSearch,
  greedyRandomizedAdaptiveSearch,
  guidedLocalSearch,
  iteratedLocalSearch,
  randomSearch,
  scatterSearch,
  stochasticHillClimbingSearch,
  variableNeighborhoodSearch
}

/* END */
