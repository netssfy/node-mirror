'use strict';

const _ = require('lodash');
const path = require('path');

function factory(config) {
  let formattors = [];
  const cwd = process.cwd();
  if (!_.isEmpty(config.formattors)) {
    for (let formatorConfig of config.formattors) {
      let factory = require(path.join(cwd, formatorConfig.path));
      formattors.push(factory(formatorConfig));
    }
  }

  return new Printer(formattors);
}

class Printer {
  constructor(formattors) {
    this.formattors = formattors;
    let funcs = ['info', 'warn', 'error'];
    for (let func of funcs) {
      this[func] = function() {
        for (let formattor of this.formattors) {
          if (formattor[func])
            formattor[func].apply(formattor, arguments);
          else
            throw `formattor ${formattor.name} has no ${func} function`;
        }
      }
    }
  }
}

module.exports = factory;