# DATA x QUERY - How this Bot work

Thanks to Twitter's APIs I've been busing playing with data for few days ^^

## Where

Twitter provides few endpoints that reach data with different quantity or quality.

Depending of what you needs you'll use one of the following :

- Standard Endpoint -> `/1.1/search/tweets.json?{yourQuery}`
- Premium 30day -> `/1.1/tweets/search/30day/{yourNameSpace}.json?{yourQuery}`
- Premium FullArchive -> `/1.1/tweets/search/fullarchive/{yourNameSpace}.json?{yourQuery}`

The standard endpoint reach 15 tweets until 7days. It's not enough except for understanding the Twitter's APIs... While looking at the data I was concerned about the possibility of automating the process.

Finally I've discovered the endpoint `Premium 30 days` which I can use for free (if used carefully) and after tweaking the query, we can automate data archiving !

# Current Querys

Not very cool, a lot of manual task and we're currently using the standard endpoint.

# Futur

## When

The bot will automatally ask Twitter for data every weeks : a query will be calculate based from the current until the last 7 days.

## How

The Premium 30days is able to query lots of Tweets but those will be limited to 256 characters, I think it's enough for archiving.

If we need to reach more information about a tweet object, an URL is generated by TW and allows to see the tweet and it's reply in your interner browser ;) 
