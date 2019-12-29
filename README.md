# Datastream Archiver

Archiving Tweets from the world leaders to Arweave's Permafeed blockchain.

## Setting up this bot

1. You can start by creating your virtual environment : `python3 -m venv venv/`

2. To use the venv : `source venv/bin/activate`

3. Adding dependencies : `pip3 install -r requirements.txt`

4. You need to have Twitter developer credentials. Replace the current consumer_key and secret_key by you own ;)

## Using this bot

A very simple usage :

    python3 twitter-feed.py -l mocked_list.json

You can also search by tweets-tag or account. Documentation :

    python3 twitter-feed.py -h

Next step : connecting to Arweave blockhain network and store every correct data.
