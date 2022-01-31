/*******************************************************************************
** Stoachistic Algorithms **
Random Search
Adaptive Random Search
Stochastic Hill Climbing Search
Iterated Local Search
Guided Local Search
Variable Neighborhood Search
Greedy Randomized Adaptive Search
Scatter Search
Tabu Search
Reactive Tabu Search
*******************************************************************************/
const { randomSearch } = require('./random_search')
const { adaptiveRandomSearch } = require('./adaptive_random_search')
const { stochasticHillClimbingSearch } = require('./stochastic_hill_climbing')
const { iteratedLocalSearch } = require('./iterated_local_search')
const { guidedLocalSearch } = require('./guided_local_search')
const { variableNeighborhoodSearch } = require('./variable_neighborhood_search')
const { greedyRandomizedAdaptiveSearch } = require('./greedy_randomized_adaptive_search')
const { scatterSearch } = require('./scatter_search')
const { tabuSearch } = require('./tabu_search')
const { reactiveTabuSearch } = require('./reactive_tabu_search')

module.exports = {
  adaptiveRandomSearch,
  greedyRandomizedAdaptiveSearch,
  guidedLocalSearch,
  iteratedLocalSearch,
  randomSearch,
  reactiveTabuSearch,
  scatterSearch,
  stochasticHillClimbingSearch,
  tabuSearch,
  variableNeighborhoodSearch
}

/* END */
