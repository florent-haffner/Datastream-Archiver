from json import load
from os import makedirs, path, getenv
from requests import get, post, codes
from logs import logger
from argparse import ArgumentParser
from dotenv import load_dotenv

""""
Defining arguments parser to use command line
"""
parser = ArgumentParser(description="BOT used to Query Twitter's API")
parser.add_argument('-l', '--list', required=False, 
    help="Querying a list of defined Account.")
parser.add_argument('-t', '--tweets', dest='tweets', required=False,
    help="Querying specific Tweets tag")
parser.add_argument('-a', '--account', dest='screen_name', required=False,
    help="Querying Tweets from a specific Account")
args = parser.parse_args()

# Get API credentials from .env
load_dotenv()
CONSUMER_API_KEY = getenv('CONSUMER_API_KEY')
API_SECRET_KEY = getenv('API_SECRET_KEY')


class TwitterFeed():
    # Class Attributes
    TW_API_URL = 'https://api.twitter.com/'
    BEARER_TOKEN = ''
    SEARCH_ENDPOINT = '1.1/search/tweets.json?q='

    # Constructor
    def __init__(self):
        self.get_auth_token()

    # Class method
    def get_auth_token(self) -> None:
        body = { 
            'grant_type':'client_credentials' 
        }
        res = post(
            self.TW_API_URL + 'oauth2/token',
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

    def args_parse_routing(self) -> None:
        if(args.tweets != None):
            getArgument = vars(args)['tweets']
            self.get_global_query_through_tweets(getArgument)
        if(args.list != None):
            getArgument = vars(args)['list']
            self.query_api_from_mocked_list(getArgument)
        if(args.screen_name != None):
            getArgument = vars(args)['screen_name']
            self.get_tweets_from_a_specific_user(getArgument)

    def get_tweets_from_a_specific_user(self, QUERY_PARAMETER) -> object:
        res = get(
            self.TW_API_URL + self.SEARCH_ENDPOINT + '(from:' + QUERY_PARAMETER 
                + ')&src='+ 'typed_query',
            headers={ 'Authorization':'Bearer ' + self.BEARER_TOKEN}
        ) 
        print('Querying Tweets from ' + QUERY_PARAMETER + "'s account.")
        self.writing_in_filesystem('USER', QUERY_PARAMETER, res.text)

    def query_api_from_mocked_list(self, LIST_TO_QUERY_FROM_FILE) -> str:
        with open(LIST_TO_QUERY_FROM_FILE, 'r') as inputfile:
            data = load(inputfile)
            for item in data:
                QUERY_PARAMETER = item['screen_name']
                print('Querying Tweets from: ' + QUERY_PARAMETER)
                
                QUERY_URL = (self.TW_API_URL + self.SEARCH_ENDPOINT + 
                        '(from:' + QUERY_PARAMETER +
                        ')until%3A' + '2019-12-30' + 'since%3A' + '2019-12-01' +
                        '&src=' + 'typed_query&f=live'
                )
                res = get(QUERY_URL, headers={ 'Authorization':'Bearer ' + self.BEARER_TOKEN })
                self.writing_in_filesystem('USER', QUERY_PARAMETER, res.text)

    def get_global_query_through_tweets(self, QUERY_PARAMETER) -> object:
        res = get(
            self.TW_API_URL + self.SEARCH_ENDPOINT + QUERY_PARAMETER,
            headers={ 'Authorization':'Bearer ' + self.BEARER_TOKEN}
        )
        print('Querying Tweets based on ' + QUERY_PARAMETER + "'s tag.")
        self.writing_in_filesystem('TWEETS', QUERY_PARAMETER, res.text)

    def writing_in_filesystem(self, TYPE, QUERY_PARAMETER, API_RESULT) -> None:
        defined_folder = './data'
        if not path.exists(defined_folder):
            makedirs(defined_folder)
        filename = f'{defined_folder}/{TYPE}' + '-' + f'{QUERY_PARAMETER}' + '.json'

        with open(filename, 'w') as file:
            file.write(API_RESULT)

    
if __name__ == '__main__':
    TwitterFeed()
