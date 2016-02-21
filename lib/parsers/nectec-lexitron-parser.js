'use strict';

var cheerio = require('cheerio');

class LexitronParser {

  parse(table) {
    var result = [],
        $ = cheerio.load(table),
        rows = $('table').find('tr');

    rows.each( (i, e) => {
      var term = $($(e).find('td')[0]).text(),
          definition = $(e).find('td')[1];

      var extectedData = this.extractDefinition(definition);

      result.push({
        term: term,
        'pos': extectedData.partOfSpeech,
        'def': extectedData.definitions,
        'also': extectedData.seeAlso,
        'syn': extectedData.synonyms,
        'ex': extectedData.examples
      });
    });

    return result;
  }

  extractDefinition(definition) {
    var result = {},
        $ = cheerio.load(definition),
        tokenType;

    var cleanTokens = $('td').contents()
    .map(function (index, elem) {
        return $(elem).text().trim();
    })
    .filter(function (index, text) {
      return text.length > 0 && text != ',';
    })
    .each(function(index, text) {

      // part of speech and definition is guaranteed to be first one
      if (index == 0) {
        result.partOfSpeech = text.substring(1, text.indexOf(']'));

        result.definitions = text
          .substring(text.indexOf(']')+1, text.length)
          .split(',')
          .filter( def => { return def.length > 0 })
          .map( def => { return def.trim() });
      }

      if (text === 'See also:' || text === 'Syn.' || text === 'Example:') {
        tokenType = text;
        // skip this token, since these tokens only trigger state change
        return;
      }

      // handle token types
      if (tokenType === 'See also:') {
        if (result.seeAlso) result.seeAlso.push(text)
        else result.seeAlso = [text];
      }
      else if (tokenType == 'Syn.') {
        if (result.synonyms) result.synonyms.push(text)
        else result.synonyms = [text];
      }
      else if (tokenType == 'Example:') {
        if (result.examples) result.examples.push(text)
        else result.example = [text];
      }

    });

    return result;
  }
}

module.exports = LexitronParser;
