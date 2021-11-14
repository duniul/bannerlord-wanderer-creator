const { parse } = require('fast-xml-parser');

function parseXmlToJs(xml) {
  return parse(xml, {
    attrNodeName: '_attrs',
    attributeNamePrefix: '',
    ignoreAttributes: false,
    ignoreNameSpace: true,
    allowBooleanAttributes: false,
    parseAttributeValue: true,
    parseNodeValue: true,
    parseTrueNumberOnly: false,
    trimValues: true,
    arrayMode: false,
    stopNodes: ['parse-me-as-string'],
    alwaysCreateTextNode: false,
  });
}

module.exports = {
  parseXmlToJs,
};
