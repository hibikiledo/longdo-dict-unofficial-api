'use strict';

var cheerio = require('cheerio');

var LexitronParser = require('./parsers/nectec-lexitron-parser');

var parsers = {
  lexitron: new LexitronParser()
}

class LongdoDictResultParser {

  parse(html) {
    var result = {},
        $ = cheerio.load(html),
        elements = $('body').children();

    elements.each( function(i, e) {
      var elementText = $(e).text();
      if (elementText === 'NECTEC Lexitron Dictionary EN-TH') {
        result['Lexitron-EN-TH'] = parsers.lexitron.parse(elements.get(i+1));
      }
    });

    return result;
  }
}

module.exports = LongdoDictResultParser;
