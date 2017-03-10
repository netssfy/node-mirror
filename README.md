# node-mirror

## scenario
I am refactoring a http service project. Enormous changes are introduced into the project, for instance, logger, error handling, result formmator and so on.
Though code are fresh new, the api or interface is not changed.
I need make sure each api returns the same value as pre-refactor exactly.
Thus this tool becomes

## usage
write your config by imitating config.example.js in node-mirror project
```javascript
module.exports = {
  name: 'node mirror',
  environment: {
    leftBaseUrl: 'http://localhost:8090/',
    rightBaseUrl: 'http://localhost:1699/',
    headers: {},
    cookies: ''
  },
  formatters: [
    {
      path: './core/formatter/console'
    },
    {
      path: './core/formatter/file',
      output: './output.txt'
    }
  ],
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
```
* environment.headers is gloabl headers config and can be replaced by the one in test case
* environment.cookies is gloabl cookies config and can be replaced by the one in test case
* formatters[index].path indicate the formatter's code path. it means you can write you own formatter and put is here.
console and file are 2 built-in formatter
* cases[index].path for a test case. if both side has the path only need this item
* cases[index].leftPath overrides path for left side if exists
* cases[index].rightPath overrides path for right side if exists
* cases[index].cookies overrides global cookies if exists
* cases[index].headers overrides global headers if exists

## expansion
#### formatter
write a nodejs module which return a factory function
```javascript
function factory(config) {
  //your own code
  return formatterObect;
}
```
 factory function take config as parameter and return a formatterObject which should contains 3 functions: info, warn, error
 config is passed by node-mirror engine and is equal the formatters section in config file
 
#### comparator
currently only support json compare, will allow user to write and specify the comparator by their own