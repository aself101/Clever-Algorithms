/*******************************************************************************
** Evolutionary Algorithms **
Genetic Algorithm
*******************************************************************************/
const { geneticAlgorithmSearch } = require('./genetic_algorithm')
const { evolutionaryStrategySearch } = require('./evolution_strategies')
const { differentialEvolutionSearch } = require('./differential_evolution')

module.exports = {
  differentialEvolutionSearch,
  evolutionaryStrategySearch,
  geneticAlgorithmSearch
}


/* END */
