'use strict';

module.exports = {
  name: 'little pomelo',
  environment: {
    leftBaseUrl: 'http://localhost:8090/',
    rightBaseUrl: 'http://localhost:1699/'
  },
  cases: [{
    name:'1',
    method: 'get',
    //if left == right only set this field. otherwise, set below 2 fields separately.
    path: 'pomelo',
    leftPath: 'pomelo',
    rightPath: 'pomelo',
    cookies: '',
    headers: {}
  }]
};