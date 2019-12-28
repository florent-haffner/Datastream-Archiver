from requests import get, post, codes, exceptions

class Connection():
    TWITTER_API_URL = 'https://api.twitter.com/'
    BEARER_TOKEN = ''

    def __init__(self):
        self.get_auth_token()
        self.get_response_api()

    def get_auth_token(self):
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

    def get_response_api(self):
        print(self.TWITTER_API_URL)
        print(self.BEARER_TOKEN)


if __name__ == '__main__':
    Connection()
