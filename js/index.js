require('../css/index.scss');
let moment = require('moment');

document.getElementById("webpack-test").innerHTML="Webpack is running. The time is: " + moment().format('h:mm:ss a');
