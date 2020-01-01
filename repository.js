import fs from 'fs'

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

export { write_on_filesystem }
