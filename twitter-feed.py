import json
from os import makedirs, path
from requests import get, post, codes
from logs import logger
from argparse import ArgumentParser

""""
Defining arguments parser to enable query from te command line
"""
parser = ArgumentParser(description="BOT used to Query Twitter's API")
parser.add_argument('-l', '--list', required=False, 
    help="Querying a list of defined Account.")
parser.add_argument('-t', '--tweets', dest='tweets', required=False,
    help="Querying specific Tweets tag")
parser.add_argument('-a', '--account', dest='account', required=False,
    help="Querying Tweets from a specific Account")
args = parser.parse_args()


class TwitterFeed():
    TWITTER_API_URL = 'https://api.twitter.com/'
    BEARER_TOKEN = ''

    SEARCH_ON_TWEETS_URL = '1.1/search/tweets.json?q='

    def __init__(self):
        self.get_auth_token()

    def get_auth_token(self) -> None:
        CONSUMER_API_KEY = 'ra14bd0Uh4HucF6NJIXSnp8uk'
        API_SECRET_KEY = 'kt0ACGvJ8jdob7a5WR6F3wxRUFkAv1bZFSnefrabCDDvrt0R4P'
        body = { 'grant_type':'client_credentials' }

        res = post(
            self.TWITTER_API_URL + 'oauth2/token',
            auth=(CONSUMER_API_KEY, API_SECRET_KEY),
            data=body
        )

        if(res.status_code == codes.ok):
            self.BEARER_TOKEN = res.json()['access_token']
            self.args_parse_routing()
        if(res.status_code > codes.ok):
            error_message = 'Issue during connection to Twitter, verify you credentials or the URL!'
            logger.error(error_message)
            print(error_message)

    def args_parse_routing(self):
        if(args.tweets != None):
            getArgument = vars(args)['tweets']
            self.get_global_query_through_tweets(getArgument)
        if(args.list != None):
            getArgument = vars(args)['list']
            self.query_api_from_mocked_list(getArgument)
        if(args.account != None):
            getArgument = vars(args)['account']
            self.get_tweets_from_a_specific_user(getArgument)

    def get_tweets_from_a_specific_user(self, QUERY_PARAMETER):
        res = get(
            self.TWITTER_API_URL + self.SEARCH_ON_TWEETS_URL + '(from:' + QUERY_PARAMETER + ')&src=typed_query',
            headers={ 'Authorization':'Bearer ' + self.BEARER_TOKEN}
        ) 
        print('Querying Tweets from ' + QUERY_PARAMETER + "'s account.")
        self.writing_in_filesystem('ACCOUNT', QUERY_PARAMETER, res.text)

    def query_api_from_mocked_list(self, LIST_TO_QUERY_FROM_FILE) -> str:
        with open(LIST_TO_QUERY_FROM_FILE, 'r') as inputfile:
            data = json.load(inputfile)
            for item in data:
                QUERY_PARAMETER = item['account']
                print('Querying Tweets from: ' + QUERY_PARAMETER)
                
                QUERY_URL = (self.TWITTER_API_URL + self.SEARCH_ON_TWEETS_URL + 
                        '(from:' + QUERY_PARAMETER +
                        ')until%3A' + '2019-12-30' + 'since%3A' + '2019-12-01' +
                        '&src=typed_query&f=live'
                )
                res = get(QUERY_URL, headers={ 'Authorization':'Bearer ' + self.BEARER_TOKEN })
                self.writing_in_filesystem('USER', QUERY_PARAMETER, res.text)

    def get_global_query_through_tweets(self, QUERY_PARAMETER) -> object:
        res = get(
            self.TWITTER_API_URL + self.SEARCH_ON_TWEETS_URL + QUERY_PARAMETER,
            headers={ 'Authorization':'Bearer ' + self.BEARER_TOKEN}
        )
        print('Querying Tweets based on ' + QUERY_PARAMETER + "'s tag.")
        self.writing_in_filesystem('TWEETS', QUERY_PARAMETER, res.text)

    def writing_in_filesystem(self, TYPE, QUERY_PARAMETER, API_RESULT):
        defined_folder = './data'
        if not path.exists(defined_folder):
            makedirs(defined_folder)
        filename = f'{defined_folder}/{TYPE}' + '-' + f'{QUERY_PARAMETER}' + '.json'

        with open(filename, 'w') as file:
            file.write(API_RESULT)

    
if __name__ == '__main__':
    TwitterFeed()
