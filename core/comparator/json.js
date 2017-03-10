'use strict'

const _ = require('lodash');
const diff = require('deep-diff');

function compare(left, right) {
  var result = {
    equal: false,
    diff: 'not compared'
  };
  result.equal = _.isEqual(left, right);
  if (!result.equal){
    result.diff = diff(left, right);
  }

  return result;
};

module.exports = compare; 