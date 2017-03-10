'use strict';

const _ = require('lodash');
const path = require('path');

function factory(config) {
  let formatters = [];
  const cwd = process.cwd();
  if (!_.isEmpty(config.formatters)) {
    for (let formatorConfig of config.formatters) {
      let factory = require(path.join(cwd, formatorConfig.path));
      formatters.push(factory(formatorConfig));
    }
  }

  return new Printer(formatters);
}

class Printer {
  constructor(formatters) {
    this.formatters = formatters;
    let funcs = ['info', 'warn', 'error'];
    for (let func of funcs) {
      this[func] = function() {
        for (let formatter of this.formatters) {
          if (formatter[func])
            formatter[func].apply(formatter, arguments);
          else
            throw `formatter ${formatter.name} has no ${func} function`;
        }
      }
    }
  }
}

module.exports = factory;