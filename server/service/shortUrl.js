//http://suo.im/api.php?format=json&url=http://www.baidu.com
const baseUrl = 'http://suo.im/api.php?format=json&url=';
var http = require('http');
module.exports = function(url, callback) {
  http.get(baseUrl+url, (res) => {
    const {
      statusCode
    } = res;
    const contentType = res.headers['content-type'];

    let error;
    if (statusCode !== 200) {
      error = new Error('Request Failed.\n' +
        `Status Code: ${statusCode}`);
    }
    if (error) {
      console.error(error.message);
      // consume response data to free up memory
      res.resume();
      return;
    }

    res.setEncoding('utf8');
    let rawData = '';
    res.on('data', (chunk) => {
      rawData += chunk;
    });
    res.on('end', () => {
      try {
        // const parsedData = JSON.parse(rawData);
        callback(rawData);
        } catch (e) {
        console.error(e.message);
      }
    });
  }).on('error', (e) => {
    console.error(`Got error: ${e.message}`);
  });
}
