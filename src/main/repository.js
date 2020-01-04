require('dotenv').config()

import fs from 'fs'
import Arweave from 'arweave/node'

/**
 * @param {TYPE, QUERY_PARAMETER, DATA} TYPE && QUERY_PARAMETER are used to create proeminient filename; 
                                        DATA are the information to write
    * @returns create new files
    */
function write_on_filesystem(TYPE, QUERY_PARAMETER, DATA) {
    const selected_directory = __dirname + '/data';
    !fs.existsSync(selected_directory) && fs.mkdirSync(selected_directory)

    let filename = selected_directory + '/' + TYPE + '-' + QUERY_PARAMETER + '.json'
    fs.appendFileSync(filename, JSON.stringify(DATA));
}

/**
 * @param FILE, get a file to map through
 * @returns void
 * 
 * Change the filesystem state by creating new files to store Permafeed's data
 */
function create_data_file(FILE) {
    let data = JSON.parse(FILE)
    const selected_directory = __dirname + '/../data';
    !fs.existsSync(selected_directory) && fs.mkdirSync(selected_directory)

    for(let [key, value] of Object.entries(data)) {
        let filename = selected_directory + '/' + 'TWITTER' + '-' + value['screen_name'] + '.json'
        let this_file_exists = fs.existsSync(filename)

        if(this_file_exists == false) {
            let data_object = new Object()
            data_object.country = value['country']
            data_object.activity = value['activity']
            data_object.title = value['title']
            data_object.name = value['name']
            data_object.twitter_screen_name = value['screen_name']
            data_object.tweets_list = []

            let jsonObject = JSON.stringify(data_object)
            fs.appendFileSync(filename, jsonObject);
        }
    }
}

/**
 * @param none
 * @returns none
 * 
 * Read the Arweave network and get information to route data transaction
 */
function read_arweave_permaweb() {
    const wallet = process.env.PERMAFEED_WALLET
    const instance = Arweave.init({
        protocol: process.env.AR_PROTOCOL,
        host: process.env.AR_NODE_HOST,
        port: process.env.AR_PORT
    })

    let info = instance.network.getInfo()

    instance.wallets.getBalance(wallet)
    .then((balance) => {
        console.log('Balance of the wallet')

        let winston = balance
        let ar = instance.ar.arToWinston(balance)

        console.log(winston)
        // My balance

        console.log(ar)
        // Wot is this?
    instance.wallets.getLastTransactionID(wallet)
    .then((transaction) => {
        console.log('\nLast transaction of the wallet')
        console.log(transaction)
    })
})

    
}

export { write_on_filesystem, create_data_file, read_arweave_permaweb }
