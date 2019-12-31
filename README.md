# Datastream Archiver

Simple bot written to archive data from Twitter to Arweave's Permafeed blockchain.

> Initially developed in Python3 but I had to rewrite to program to simplify the dataflow. 

> The current implementation (Python3 or Node.js) only enable query from Twitter and store on you filesystem.

## Setup (Node.js)

1. Node.js LTS (12.14) -> https://nodejs.org/

2. `npm install`

3. You need Twitter developer's credentials. Replace the .env informations by you own ;)

## Setup (Python3)

1. Python3 (v3.7 at least) -> https://www.python.org/

2. Python Virtual env :

    > python3 -v venv venv/
    
    > source venv/bin/activate

3. `pip3 install -r requirements.txt`

## Using the Node.js implementation

A very simple usage :

    npm start

It get data from `account_list_to_query.json` then map and query each item's value on ['screen_name'] from Twitter.

You can also search by tweets-tag or account. Call the programm then give argument and value such as : 

    node index.js --account ArweaveTeam
    
## Using the Python3 implementation

    python3 twitter-feed.py -l account_list_to_query.json
    
It gets the same arguments that the Node.js

## Program Documentation

    node index.js -h

or

    python3 twitter-feed.py -h

Come back on branch Master for an updated version...
