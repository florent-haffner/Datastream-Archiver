# Datastream Archiver

Simple bot written in Node.js to archive data from Twitter to Arweave's Permafeed blockchain.

> It's not fully fonctional, I had to rewrite to program to simplify the dataflow. The current implementation only enable query from Twitter and store on you filesystem.

## Setup

1. Node.js LTS (12.14) -> https://nodejs.org/

2. `npm install`

3. You need Twitter developer's credentials. Replace the .env informations by you own ;)

## Using this bot

A very simple usage :

    npm start

It get data from `account_list_to_query.json` then map and query each item's value on ['screen_name'] from Twitter.

You can also search by tweets-tag or account. Call the programm then give argument and value such as : 

    node index.js --account ArweaveTeam

## Program Documentation

    node index.js -h

Next step : connecting to Arweave's blockhain network and store data.
