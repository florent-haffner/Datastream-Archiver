// Messy part of the app lol
var argv = require('./cli_config') // Get cli_arguments
require('dotenv').config(); // Get variables from .env

import fetch from 'node-fetch'
import { write_on_filesystem, read_arweave_permaweb } from './repository'

class Bot 
{
    /**
     * class Attributes
     */
    CONSUMER_API_KEY = process.env.CONSUMER_API_KEY
    API_SECRET_KEY = process.env.API_SECRET_KEY

    TW_API_URL = 'https://api.twitter.com/'
    BEARER_TOKEN = ''

    TWEETS_SEARCH_ENDPOINT = '1.1/search/tweets.json?q='
    ACCOUNT_SEARCH_ENDPOINT = '1.1/statuses/user_timeline.json?screen_name='
    PREMIUM_30DAYS_ENDPOINT = '1.1/tweets/search/30day/' + process.env.NAMESPACE + '.json?query='

    constructor() {
        this.getIdentityToken();
        // read_arweave_permaweb()
    }

    /**
     * @returns void, 
     * Change state object then choose function destination based on command line interface argument passed
     */
    getIdentityToken() {
        fetch(this.TW_API_URL + 'oauth2/token', {
            method: 'POST',
            headers: {
                'Authorization': 'Basic ' + Buffer.from(
                    this.CONSUMER_API_KEY + ":" + this.API_SECRET_KEY
                ).toString('base64'),
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: 'grant_type=client_credentials'
        }).then(res => {
                if(res.status >= 400 && res.status < 600) {
                    throw new Error("Bad Response: verify you credentials or the url endpoint")
                }
                return res.json()
            })
            .then(data => {
                this.BEARER_TOKEN = data['access_token']
                this.cli_based_query_routing(argv)
        }).catch((err) => { console.error(err) })
    }

    /**
     * @param get argument passed in CLI to define routing in dataflow
     * @returns void
     */
    cli_based_query_routing = (argv) => {
        if (argv['tweets'] != undefined) {
            let QUERY_PARAMETER = argv['tweets']
            this.query_recent_tweet_based_on_tag(QUERY_PARAMETER)
        }
        if (argv['list'] != undefined) {
            let QUERY_PARAMETER = argv['list']
            this.read_file_then_query_each_account(QUERY_PARAMETER)
        }
        if (argv['account'] != undefined) {
            let QUERY_PARAMETER = argv['account']
            this.query_recent_7days_tweets_from_account(QUERY_PARAMETER)
        }
        if (argv['premium'] != undefined) {
            let QUERY_PARAMETER = argv['premium']
            this.query_30days_tweets_from_account(QUERY_PARAMETER)
        }
    }

    /**
     * @param {QUERY_PARAMETER} information to get from Twitter's free search endpoint 
     * @returns void
     */
    query_recent_tweet_based_on_tag(QUERY_PARAMETER) {
        fetch(this.TW_API_URL + this.TWEETS_SEARCH_ENDPOINT + QUERY_PARAMETER, {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + this.BEARER_TOKEN }
        })
        .then(res => {
                if(res.status >= 400 && res.status < 600) {
                    throw new Error("Bad Response: authorization required or haven't find tweets related to this Hashtag.")
                }
                return res.json()
            })
        .then(data => {
            console.log('Querying Tweets using tags: ' + QUERY_PARAMETER)
            if(data['statuses'].length == 0) {
                throw new Error('Not enough recent data containing #Hashtag: ' + QUERY_PARAMETER)
            }
            write_on_filesystem('TWEETS', QUERY_PARAMETER, data['statuses'])
        }).catch((err) => { console.error(err) })
    }

    /**
     * @param {QUERY_PARAMETER} information to get from Twitter's free search endpoint 
     * @returns void
     */
    query_recent_7days_tweets_from_account(QUERY_PARAMETER) {
        fetch(this.TW_API_URL + this.ACCOUNT_SEARCH_ENDPOINT + QUERY_PARAMETER, {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + this.BEARER_TOKEN }
        })
        .then(res => {
            if(res.status >= 400 && res.status < 600) {
                throw new Error("Bad Response: maybe this Account doesen't exist?")
            }
            return res.json()
        })
        .then(data => {
            console.log('Querying Tweets from: ' + QUERY_PARAMETER)
            write_on_filesystem('USER', QUERY_PARAMETER, data)
        }).catch((err) => { console.error(err) })
    }

    /**
     * @param {QUERY_PARAMETER} information to get from Twitter's Premium 30days search endpoint 
     * @returns void
     */
    query_30days_tweets_from_account(QUERY_PARAMETER) {
        fetch(this.TW_API_URL + this.PREMIUM_30DAYS_ENDPOINT + '(from:' + QUERY_PARAMETER + ')', {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + this.BEARER_TOKEN }
        })
        .then(res => {
            if(res.status >= 400 && res.status < 600) {
                throw new Error("Bad Response: maybe this Account doesen't exist?")
            }
            return res.json()
        })
        .then(data => {
            console.log('Querying Tweets from: ' + QUERY_PARAMETER)
            write_on_filesystem('USER', QUERY_PARAMETER, data)
        }).catch((err) => { console.error(err) })
    }

    /**
     * @param {file} FILE to get data from then map though a function which query data on Twitter's API
     * @returns void
     */
    read_file_then_query_each_account(FILE) {
        let data = JSON.parse(FILE)
        for(let [key, value] of Object.entries(data)) {
            let screen_name = value['screen_name']
            this.query_recent_7days_tweets_from_account(screen_name)
        }
    }

}

// Sorry not a JS expert, please send a nice PR if it bother you =D 
var app = new Bot();
