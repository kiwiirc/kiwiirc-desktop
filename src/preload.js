const preloads = window.preloads = Object.create(null);

preloads.transport = require('irc-framework/src/transports/net');

// sysinfo.js
preloads.pkg = require('../package.json');
preloads.os = require('os');
