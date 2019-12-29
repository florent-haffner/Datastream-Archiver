# Datastream Archiver

Archiving Tweets from the world leaders to Arweave's Permafeed blockchain.

## Setting up this bot

You can start by creating your virtual environment : `python3 -m venv venv/`

To use a venv : `source venv/bin/activate`

Adding dependencies : `pip3 install -r requirements.txt`

## Using this bot

Currently under heavy develpment.

You need to have Twitter developer credentials. Replace the current consumer_key and secret_key by you own ;)

Actually you can interact with this CLI by using :

    python3 tweeter-feed.py

In futur you should be querying stuff following this syntax 

`python3 tweeter-feed.py {who: mocked_list if empty} {nbr_days} {type_of_save}`

`python3 tweeter-feed.py 7day fs`

`python3 tweeter-feed.py trump 30day permafeed`
