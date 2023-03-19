import { XMLBuilder, XMLParser } from 'fast-xml-parser';

const SHARED_PARSER_OPTIONS = {
  commentPropName: '_comment',
  attributesGroupName: '_attrs',
  attributeNamePrefix: '',
  hmm: 'test',
};

const xmlParser = new XMLParser({
  ...SHARED_PARSER_OPTIONS,
  ignoreAttributes: false,
  allowBooleanAttributes: false,
  parseAttributeValue: true,
  trimValues: true,
  alwaysCreateTextNode: false,
});

const xmlBuilder = new XMLBuilder({
  ...SHARED_PARSER_OPTIONS,
  ignoreAttributes: false,
  processEntities: false,
  format: true,
  indentBy: '  ',
  suppressEmptyNode: true,
  suppressBooleanAttributes: false,
});

export function parseXml<TResult extends Object = any>(xml: string): TResult {
  return xmlParser.parse(xml);
}

export function buildXml(jsXmlObject: Object, options: { declaration?: boolean } = {}): string {
  const { declaration } = options;
  let xml = xmlBuilder.build(jsXmlObject);

  if (declaration) {
    xml = `<?xml version="1.0" encoding="utf-8"?>\n` + xml;
  }

  return xml;
}
