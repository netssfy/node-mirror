'use strict';

const url = require('url');
const request = require('request-promise');

function factory(config) {
  const leftBaseUrl = config.environment.leftBaseUrl;
  const rightBaseUrl = config.environment.rightBaseUrl;
  const globalCookies = config.environment.cookies;
  const globalHeaders = config.environment.headers;

  return function* fetch(testcase) {
    //获取left结果
    const leftPath = testcase.leftPath ? testcase.leftPath : testcase.path;
    const pLeft = send(leftBaseUrl, leftPath, testcase.method, testcase.headers || globalHeaders, testcase.cookies || globalCookies, testcase.body);

    //获取right结果
    const rightPath = testcase.rightPath ? testcase.rightPath : testcase.path;
    const pRight = send(rightBaseUrl, rightPath, testcase.method, testcase.headers || globalHeaders, testcase.cookies || globalCookies, testcase.body);

    const results = yield Promise.all([pLeft, pRight]);
    return {
      left: results[0],
      right: results[1]
    };
  };
}

function send(baseUrl, path, method, headers, cookies, body) {
  const j = request.jar();
  j.setCookie(cookies || '', baseUrl);

  const options = {
    url: url.resolve(baseUrl, encodeURI(path)),
    method: method,
    headers: headers,
    jar: j,
    json: true
  }

  if (body) 
    options.body = body;

  return request(options);
}

module.exports = factory;