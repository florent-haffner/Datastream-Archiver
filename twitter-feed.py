from requests import get, post, codes

class Connection():
    TWITTER_API_URL = 'https://api.twitter.com/'
    BEARER_TOKEN = ''

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
            self.ask_user_for_query()
        if(res.status_code > codes.ok):
            error_message = 'Issue during connection to Twitter, verify you credentials or the URL!'
            print(error_message)

    def ask_user_for_query(self):
        print('Tell me what Twitter account should I query?')
        QUERY_PARAMETER = input()
        self.get_response_api(QUERY_PARAMETER)

    def get_response_api(self, parameter_to_query) -> object:
        res = get(
            self.TWITTER_API_URL + '1.1/search/tweets.json?q=' + parameter_to_query,
            headers={ 'Authorization':'Bearer ' + self.BEARER_TOKEN}
        )
        print(res.json())


if __name__ == '__main__':
    Connection()
