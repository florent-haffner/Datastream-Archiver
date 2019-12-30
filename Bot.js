require('dotenv').config(); // Get variables from .env
var argv = require('./cli_config')

import fetch from 'node-fetch'
import { Headers } from 'node-fetch'

const CONSUMER_API_KEY = process.env.CONSUMER_API_KEY
const API_SECRET_KEY = process.env.API_SECRET_KEY

const TW_API_URL = 'https://api.twitter.com/'
let BEARER_TOKEN = ''

const TWEETS_SEARCH_ENDPOINT = '1.1/search/tweets.json?q='
const ACCOUNT_SEARCH_ENDPOINT = '1.1/statuses/user_timeline.json?screen_name='

const auth_header = 
// console.log(auth_header)

fetch(TW_API_URL + 'oauth2/token', {
    method: 'POST',
    headers: {
        'Authorization': 'Basic ' + Buffer.from(CONSUMER_API_KEY + ":" + API_SECRET_KEY).toString('base64'),
        'Content-Type':'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials'
})
.then(res => res.json())
.then(data => BEARER_TOKEN = data['access_token'])



// CLI-parser Routing 
if(argv['tweets'] != undefined) {
    console.log('Query Tweets')
}
if(argv['list'] != undefined) {
    console.log('Query Account from JSON')
}
if(argv['account'] != undefined) {
    console.log('Query Account CLI')
}
