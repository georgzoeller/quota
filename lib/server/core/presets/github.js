'use strict';

var Quota = require('../quota.js');
var _ = require('lodash');

/**
 * Quota Preset for GitHub
 *
 * Quota rules based on: https://developer.github.com/v3/#rate-limiting
 * GitHub API docs: https://developer.github.com/v3/
 *
 * @param options
 * @returns {Quota}
 */
module.exports = function (options) {

    _.defaults(options, {
        authenticated: true,
        forSearchAPI: false,
        stickySessions: false
    });

    var quota = new Quota({
        //cancelAfter: 1000,
        backoff: 'timeout'
    });

    var ruleOptions = {
        throttling: 'window-sliding',
        queueing: 'fifo',
        systemOfRecord: options.stickySessions ? 'self' : 'database',
        scope: ['userId'],
        resources: ['requests']
    };

    if (options.forSearchAPI) {

        _.assign(ruleOptions, {
            limit: options.authenticated ? 30 : 10,
            window: 60*1000
        });

    } else {

        _.assign(ruleOptions, {
            limit: options.authenticated ? 5000 : 60,
            window: 60*60*1000
        });

    }

    quota.addRule(ruleOptions);

    return quota;

};