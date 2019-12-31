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
     * Change state object then choose function destination based on command line interface argument passed
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
     * @param get argument passed in CLI to define routing in dataflow
     * @returns void
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
            this.get_tweets_query_from_account(QUERY_PARAMETER)
        }
    }

    /**
     * @param {QUERY_PARAMETER} information to get from Twitter's Tweet search endpoint 
     * @returns void
     */
    get_global_query_through_tweet_tag(QUERY_PARAMETER) {
        fetch(this.TW_API_URL + this.TWEETS_SEARCH_ENDPOINT + QUERY_PARAMETER, {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + this.BEARER_TOKEN }
        })
        .then(res => res.json())
        .then(data => {
            console.log('Querying Tweets using tags: ' + QUERY_PARAMETER)
            this.write_on_file_system('TWEETS', QUERY_PARAMETER, data['statuses'])
        })
    }

    /**
     * @param {QUERY_PARAMETER} information to get from Twitter's Account search endpoint 
     * @returns void
     */
    get_tweets_query_from_account(QUERY_PARAMETER) {
        fetch(this.TW_API_URL + this.ACCOUNT_SEARCH_ENDPOINT + QUERY_PARAMETER, {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + this.BEARER_TOKEN }
        })
        .then(res => res.json())
        .then(data => {
            console.log('Querying Tweets from: ' + QUERY_PARAMETER)
            this.write_on_file_system('USER', QUERY_PARAMETER, data)
        })
    }

    /**
     * @param {file} FILE to get data from then map though a function which query data on Twitter's API
     * @returns void
     */
    read_file_then_query_each_account(FILE) {
        let data = JSON.parse(FILE)
        for(let [key, value] of Object.entries(data)) {
            let screen_name = value['screen_name']
            this.get_tweets_query_from_account(screen_name)
        }
    }

    /**
     * @param {TYPE, QUERY_PARAMETER, DATA} TYPE && QUERY_PARAMETER are used to create proeminient filename; 
                                            DATA are the information to write
     * @returns create new files
     */
    write_on_file_system(TYPE, QUERY_PARAMETER, DATA) {
        const selected_directory = __dirname + '/data';
        !fs.existsSync(selected_directory) && fs.mkdirSync(selected_directory)

        let filename = selected_directory + '/' + TYPE + '-' + QUERY_PARAMETER + '.json'
        fs.appendFileSync(filename, JSON.stringify(DATA));
    }

}


// Sorry not a JS expert, please send a correct PR if it bother you =D 
new Bot();
