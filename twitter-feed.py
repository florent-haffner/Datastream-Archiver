from os import makedirs, path
from requests import get, post, codes
from logs import logger
from mocked_list import list_to_query

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
            self.ask_for_user_choice()

        if(res.status_code > codes.ok):
            error_message = 'Issue during connection to Twitter, verify you credentials or the URL!'
            logger.error(error_message)
            print(error_message)


    def ask_for_user_choice(self):
        print('What would you like to do?')
        print('1 -> Mocked list of Government head')
        print('2 -> Ask for a specific account')
        print('3 -> Get a global query through Tweets')
        ROAD = input()
        if(ROAD == '1'):
            self.query_api_from_mocked_list()
        if(ROAD == '2'):
            self.get_tweets_from_a_specific_user()
        if(ROAD == '3'):
            self.get_global_query_through_tweets()
        return

    def get_tweets_from_a_specific_user(self):
        print('Tell me what Twitter account should I query?')
        QUERY_PARAMETER = input()
        res = get(
            self.TWITTER_API_URL + self.SEARCH_ON_TWEETS_URL + '(from:' + QUERY_PARAMETER + ')&src=typed_query',
            headers={ 'Authorization':'Bearer ' + self.BEARER_TOKEN}
        ) 
        print(res.json())

    def query_api_from_mocked_list(self) -> str:
        for item in list_to_query:
            QUERY_PARAMETER = item ['account']
            print('Querying Tweets from: ' + QUERY_PARAMETER)
            
            QUERY_URL = (self.TWITTER_API_URL + self.SEARCH_ON_TWEETS_URL + 
                    '(from:' + QUERY_PARAMETER +
                    ')until%3A' + '2019-12-30' + 'since%3A' + '2019-12-01' +
                    '&src=typed_query&f=live'
            )
            res = get(QUERY_URL, headers={ 'Authorization':'Bearer ' + self.BEARER_TOKEN })
            self.writing_in_filesystem('USER', QUERY_PARAMETER, res.text)

    def get_global_query_through_tweets(self) -> object:
        print('Enter a keyword to query :')
        QUERY_PARAMETER = input()
        res = get(
            self.TWITTER_API_URL + self.SEARCH_ON_TWEETS_URL + QUERY_PARAMETER,
            headers={ 'Authorization':'Bearer ' + self.BEARER_TOKEN}
        )
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
