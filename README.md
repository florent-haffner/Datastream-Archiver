# Datastream Archiver

Archiving Tweets from the world leaders to Arweave's Permafeed blockchain.

## Setting up this bot

1. You can start by creating your virtual environment : `python3 -m venv venv/`

2. To use the venv : `source venv/bin/activate`

3. Adding dependencies : `pip3 install -r requirements.txt`

4. You need to have Twitter developer credentials. Replace the current consumer_key and secret_key by you own ;)

## Using this bot

You can query following this syntax :

`python3 tweeter-feed.py -a {account_to_query}`

`python3 tweeter-feed.py -t {tweets_tag}`

`python3 tweeter-feed.py -l {location_of_your_json_file}`

This will open the selected JSON file, query the Twitter API based on the each object key 'account' and store results in your filesystem.

A very simple and efficient usage will be : 

    python3 twitter-feed.py -l mocked_list.json

Next step : connecting to Arweave blockhain network and store every correct data.
