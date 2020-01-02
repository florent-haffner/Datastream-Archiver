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

function read_arweave_permaweb() {
    const instance = Arweave.init({
        protocol: process.env.AR_PROTOCOL,
        host: process.env.AR_HOST,
        port: process.env.AR_PORT
    })
    let info = instance.network.getInfo()
    info.then(console.log)
}

export { write_on_filesystem, read_arweave_permaweb }
