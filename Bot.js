// Messy part of the app lol
var argv = require('./cli_config') // Get cli_arguments
var fs = require('fs')
require('dotenv').config(); // Get variables from .env

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
    }

    /**
     * @returns void, 
     * 
     * Change state to get BEARER TOKEN
     */
    getIdentityToken() {
        fetch(this.TW_API_URL + 'oauth2/token', {
            method: 'POST',
            headers: {
                'Authorization': 'Basic ' + Buffer.from(this.CONSUMER_API_KEY + ":" + this.API_SECRET_KEY).toString('base64'),
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: 'grant_type=client_credentials'
        })
            .then(res => res.json())
            .then(data => {
                this.BEARER_TOKEN = data['access_token']
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
            this.get_global_query_through_tweet_tag(QUERY_PARAMETER)
        }
        if (argv['list'] != undefined) {
            let QUERY_PARAMETER = argv['list']
            this.read_file_then_query_each_account(QUERY_PARAMETER)
        }
        if (argv['account'] != undefined) {
            let QUERY_PARAMETER = argv['account']
            this.get_tweets_query_through_account(QUERY_PARAMETER)
        }
    }

    get_global_query_through_tweet_tag(QUERY_PARAMETER) {
        fetch(this.TW_API_URL + this.TWEETS_SEARCH_ENDPOINT + QUERY_PARAMETER, {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + this.BEARER_TOKEN }
        })
        .then(res => res.json())
        .then(data => {
            console.log(data['statuses'])
        })
    }

    get_tweets_query_through_account(QUERY_PARAMETER) {
        fetch(this.TW_API_URL + this.ACCOUNT_SEARCH_ENDPOINT + QUERY_PARAMETER, {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + this.BEARER_TOKEN }
        })
        .then(res => res.json())
        .then(data => {
            console.log('Okay')
        })
    }

    read_file_then_query_each_account(file) {
        let data = JSON.parse(file)
        for(let [key, value] of Object.entries(data)) {
            let screen_name = value['screen_name']
            console.log('Querying tweet from ' + value['name'])
            this.get_tweets_query_through_account(screen_name)
        }
    }

}


// Sorry not a JS expert, please send a correct PR if it bother you =D 
new Bot();
