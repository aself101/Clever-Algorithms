/*******************************************************************************
** Evolutionary Algorithms **
Genetic Algorithm
*******************************************************************************/
const { geneticAlgorithmSearch } = require('./genetic_algorithm')
const { evolutionaryStrategySearch } = require('./evolution_strategies')
const { differentialEvolutionSearch } = require('./differential_evolution')
const { evolutionaryProgrammingSearch } = require('./evolutionary_programming')

module.exports = {
  differentialEvolutionSearch,
  evolutionaryProgrammingSearch,
  evolutionaryStrategySearch,
  geneticAlgorithmSearch
}


/* END */
