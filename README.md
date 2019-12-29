# Datastream Archiver

Archiving Tweets from the world leaders to Arweave's Permafeed blockchain.

## Setting up this bot

1. You can start by creating your virtual environment : `python3 -m venv venv/`

2. To use the venv : `source venv/bin/activate`

3. Adding dependencies : `pip3 install -r requirements.txt`

4. You need to have Twitter developer credentials. Replace the current consumer_key and secret_key by you own ;)

## Using this bot

    Currently under heavy develpment.

You can query stuff following this syntax :

`python3 tweeter-feed.py -a {account_to_query}`

`python3 tweeter-feed.py -t {tweets_tag}`

`python3 tweeter-feed.py -l mocked_list.py`

    Those command will query the Twitter API then storing results in your filesystem.

Next step : connecting to Arweave blockhain network and store every correct *.json files
