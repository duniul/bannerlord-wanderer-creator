import { J2xOptions, j2xParser, parse, X2jOptions } from 'fast-xml-parser';

const SHARED_PARSER_OPTIONS = {
  attrNodeName: '_attrs',
  attributeNamePrefix: '',
};

const XML_TO_JS_OPTIONS: Partial<X2jOptions> = {
  ...SHARED_PARSER_OPTIONS,
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
};

const JS_TO_XML_OPTIONS: Partial<J2xOptions> = {
  ...SHARED_PARSER_OPTIONS,
  ignoreAttributes: false,
  format: true,
  supressEmptyNode: true,
  indentBy: '  ',
};

const jsToXmlParser = new j2xParser(JS_TO_XML_OPTIONS);

export function parseXmlToJs<TResult extends Object = any>(xml: string): TResult {
  return parse(xml, XML_TO_JS_OPTIONS);
}

export function parseJsToXml(jsXmlObject: Object, options: { declaration?: boolean } = {}): string {
  const { declaration } = options;
  let xml = jsToXmlParser.parse(jsXmlObject);

  if (declaration) {
    xml = `<?xml version="1.0" encoding="utf-8"?>\n` + xml;
  }

  return xml;
}
