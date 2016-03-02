module.exports = {

    getDBAddress: function() {
        var DB_NAME = 'local';
        var DB_HOST = '188.166.26.119';
        var DB_PORT = '27017';

        return 'mongodb://' + DB_HOST + ':' + DB_PORT + '/' + DB_NAME;
    }
};