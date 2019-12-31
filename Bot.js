// Messy part of the app lol
var argv = require('./cli_config') // Get cli_arguments
require('dotenv').config(); // Get variables from .env
new Bot();

import fetch from 'node-fetch'

class Bot {

    /**
     * class Attributes
     */
    CONSUMER_API_KEY = process.env.CONSUMER_API_KEY
    API_SECRET_KEY = process.env.API_SECRET_KEY

    TW_API_URL = 'https://api.twitter.com/'
    BEARER_TOKEN = ''

    TWEETS_SEARCH_ENDPOINT = '1.1/search/tweets.json?q='
    ACCOUNT_SEARCH_ENDPOINT = '1.1/statuses/user_timeline.json?screen_name='

    constructor() {
        this.getIdentityToken();
        this.cli_based_query_routing(argv)
    }

    /**
     * @returns void, 
     * 
     * Change state to get BEARER TOKEN
     */
    getIdentityToken() {
        fetch(TW_API_URL + 'oauth2/token', {
            method: 'POST',
            headers: {
                'Authorization': 'Basic ' + Buffer.from(CONSUMER_API_KEY + ":" + API_SECRET_KEY).toString('base64'),
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: 'grant_type=client_credentials'
        })
            .then(res => res.json())
            .then(data => {
                BEARER_TOKEN = data['access_token']
                this.cli_based_query_routing(argv)
        })
    }

    /**
     * @returns void
     * 
     * Used to define roouting in dataflow
     */
    cli_based_query_routing = (argv) => {
        if (argv['tweets'] != undefined) {
            let QUERY_PARAMETER = argv['tweets']
            console.log(QUERY_PARAMETER)
        }
        if (argv['list'] != undefined) {
            let QUERY_PARAMETER = argv['list']
            console.log(QUERY_PARAMETER)
        }
        if (argv['account'] != undefined) {
            let QUERY_PARAMETER = argv['account']
            console.log(QUERY_PARAMETER)
        }
    }

    get_global_query_through_tweet_tag() {

    }

}
