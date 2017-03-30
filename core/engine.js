'use strict';

const Formatter = require('./formatter');
const fetcherFactory = require('./fetcher');
const compare = require('./comparator/json');
const fs = require('fs');
const _ = require('lodash');

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
    
    const diffDict = {};
    for (let testcase of cases) {
      this.formatter.info(`  ${enter_separator} start case ${testcase.name} path = ${testcase.path}`);
      
      try {
        let data = yield fetcher(testcase);
        //output short sample data for user inspection
        let leftStr = JSON.stringify(data.left);
        let rightStr = JSON.stringify(data.right);
        this.formatter.info(`  left data len = ${leftStr.length}, segment = ${leftStr.substr(0, 120)}`);
        this.formatter.info(`  right data len = ${rightStr.length}, segment = ${rightStr.substr(0, 120)}`);

        let result = compare(data.left, data.right);
        if (result.equal) {
          this.formatter.info(`  result is equal! ^_^`);
        } else {
          this.formatter.error(`  result is not equal! -_-!`);
          this.formatter.error(`  diff = ${JSON.stringify(result.diff)}`);
          diffDict[`[${testcase.name}]:[${testcase.path}]`] = result.diff;
        }
      } catch (err) {
        this.formatter.error(err);
      }

      this.formatter.info(`  ${exit_separator} end case`);
    }

    //dump diff as json
    const diffFilePath = `./${this.config.name}.diff.json`;
    this.formatter.info(`total ${_.keys(diffDict).length} diff found and dump at ${diffFilePath}`);
    fs.writeFileSync(diffFilePath, JSON.stringify(diffDict));

    this.formatter.info(`${exit_separator} end mirror task! bye bye`);
  }
}

module.exports = Engine;