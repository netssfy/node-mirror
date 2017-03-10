'use strict';

const winston = require('winston');
const path = require('path');

function factory(config) {
  const cwd = process.cwd();

  const logger = new winston.Logger({
    transports: [
      new winston.transports.File({
        name: 'file',
        filename: path.join(cwd, config.output),
        level: 'info'
      })
    ]
  });

  logger.name = 'file';
  return logger;
}

module.exports = factory;