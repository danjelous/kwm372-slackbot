'use-strict';

// Real time messaging client from slack
const RtmClient = require('@slack/client').RtmClient;
const CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
const RTM_EVENTS = require('@slack/client').RTM_EVENTS;

class SlackClient {

    // log == custom logger
    constructor(token, botname, logLevel, log) {
        this._rtm = new RtmClient(token, {logLevel: logLevel});
        this._log = log;
        this._botname = botname;
    }

    _handleOnMessage(message) {

        // Only react to our OWN bot :)
        if(message.text.toLowerCase().includes(this._botname)) {
            this._rtm.sendMessage('Have a lovely day - feel yourself loved <3', message.channel);
        }
    }

    _handleOnAuthenticated(rtmStartData) {
        this._log.info(`Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}.`);
    }

    _addAuthenticatedHandler(handler) {
        this._rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, handler.bind(this));
    }

    start(handler) {
        this._addAuthenticatedHandler(handler);
        this._addAuthenticatedHandler(this._handleOnAuthenticated);        
        this._rtm.on(RTM_EVENTS.MESSAGE, this._handleOnMessage.bind(this));        
        this._rtm.start();
    }
}

module.exports = SlackClient;