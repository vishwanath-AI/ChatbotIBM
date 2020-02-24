var routers = [
    Conversation    = require('./Conversation')
];

function registerRouters (app) {
    routers.forEach(function (r) {
        app.use(r);
    });
}

module.exports = registerRouters;