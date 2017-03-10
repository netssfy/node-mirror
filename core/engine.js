'use strict';

const Formatter = require('./formatter');
const fetcherFactory = require('./fetcher');
const compare = require('./comparator/json');

const enter_separator = '>>>>>>>>>>>>>>>>>>>>';
const exit_separator = '<<<<<<<<<<<<<<<<<<<<';

class Engine {
  constructor(config) {
    this.config = config;
    this.formatter = Formatter(this.config);
  }

  *start() {
    const cases = this.config.cases;
    const env = this.config.environment;

    const fetcher = fetcherFactory(this.config);
    this.formatter.info(`${enter_separator} start mirror task ${this.config.name} with ${cases.length} cases`);
    
    for (let testcase of cases) {
      this.formatter.info(`  ${enter_separator} start case ${testcase.name}`);
      
      try {
        let data = yield fetcher(testcase);
        let result = compare(data.left, data.right);
        if (result.equal) {
          this.formatter.info(`  result is equal! ^_^`);
        } else {
          this.formatter.error(`  result is not equal! -_-!`);
          this.formatter.error(`  diff = ${JSON.stringify(result.diff)}`);
        }
      } catch (err) {
        this.formatter.error(err);
      }

      this.formatter.info(`  ${exit_separator} end case`);
    }

    this.formatter.info(`${exit_separator} end mirror task! bye bye`);
  }
}

module.exports = Engine;