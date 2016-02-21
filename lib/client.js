'use strict';

const HOST = 'dict.longdo.com';
const PATH = '/mobile.php?search=';

var http = require('http');

class LongdoDictClient {

  lookup(query) {

    // promise to return html content from look up process
    var promise = new Promise(function (resolve, reject) {

      // define http options
      var options = {
        host: HOST,
        path: PATH + query
      }

      // will hold complete html content when end event is emitted
      var html = String();

      // build request message
      var req = http.request(options, (res) => {
        console.log(`STATUS: ${res.statusCode}`);
        console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
        res.setEncoding('utf8');

        res.on('data', (chunk) => {
          html = html.concat(chunk);
        });

        res.on('end', () => {
          console.log('No more data in response.');
          resolve(html);
        });

        res.on('error', () => {
          console.log(`priblem with request: ${e.message}`);
          reject(e.message);
        });
      });

      // send the request
      req.end();

    });

    // return promise
    return promise;
  }
}

module.exports = LongdoDictClient;
