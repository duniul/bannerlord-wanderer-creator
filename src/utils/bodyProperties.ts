import { BodyProperties } from '../types/face';
import { XmlFaceWithBodyProperties } from '../types/xml';
import { parseJsToXml, parseXmlToJs } from './xml/xmlParser';

export function bodyPropertiesJsToXml(bodyProperties: BodyProperties): string {
  const jsXmlBodyProperties: XmlFaceWithBodyProperties = { BodyProperties: { _attrs: bodyProperties } };

  try {
    return parseJsToXml(jsXmlBodyProperties);
  } catch (error) {
    return 'waaa';
  }
}

export function bodyPropertiesXmlToJs(xmlString: string): BodyProperties {
  const { BodyProperties } = parseXmlToJs<XmlFaceWithBodyProperties>(xmlString);

  if (!BodyProperties || !BodyProperties._attrs.version || !BodyProperties._attrs.key) {
    throw Error('Invalid BodyProperties');
  }

  return BodyProperties._attrs;
}
