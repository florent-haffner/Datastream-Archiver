import yargs from 'yargs'

const cli_arg = yargs
    .coerce('list', function(arg) {
        return require('fs').readFileSync(arg, 'utf8')
    }).option('list', {
        alias: 'l',
        description: "Take a list in argument and query Twitter from each object's value from key=['account_name']"
    })
    .coerce('tweets', function(arg) {
        return arg
    }).option('tweets', {
        alias: 't',
        description: "Take a tweet tag in argument and query recent Twitter for data related to it."
    })
    .coerce('account', function(arg) {
        return arg
    }).option('account', {
        alias: 'a',
        description: "Take an Account name in argument and query Twitter free API."
    })
    .coerce('premium', function(arg) {
        return arg
    }).option('premium', {
        alias: 'p',
        description: "Take an Account name in argument and query Twitter's Premium API."
    })
    .help().alias('help', 'h')
    .version('v1.0')
    .argv;

export default cli_arg;
