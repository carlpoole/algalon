let config = require('../config.json');
const execSync = require('child_process').execSync;

execSync('PORT=' + config.frontend.port + ' react-scripts start', {stdio: 'inherit'})