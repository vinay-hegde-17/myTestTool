const fs = require('fs');

function getToken() {

    const data = JSON.parse(
        fs.readFileSync('./token.json')
    );

    return data.token;
}

module.exports = {
    getToken
};