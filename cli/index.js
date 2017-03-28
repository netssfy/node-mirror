'use strict';

const path = require('path');

do {
  var index = process.argv.indexOf('-c');
  if (index < 0) {
    console.log('no -c option found!');
    break;
  }

  var configFilePath = process.argv[index + 1];
  if(!configFilePath) {
    console.log('config file path is not specified after -c option');
    break;
  }

  const config = require(path.join(process.cwd(), configFilePath));

  const co = require('co');
  const Engine = require('../core/engine');

  const engine = new Engine(config);

  co(engine.start())
  .then(function() {
    console.log('bye bye!');
    process.exit(0);
  });
} while(false);