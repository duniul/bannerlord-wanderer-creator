import convert from 'xml-js';
import { BodyProperties } from '../types/face';

export function mapBodyPropertiesJsonToXml(bodyProperties: BodyProperties): string {
  try {
    const xmlString = convert.js2xml({
      elements: [
        {
          type: 'element',
          name: 'BodyProperties',
          attributes: bodyProperties,
        },
      ],
    });

    return xmlString;
  } catch (error) {
    return '';
  }
}

export function mapBodyPropertiesXmlToJson(xmlString: string): BodyProperties {
  const { name, attributes } = convert.xml2js(xmlString).elements[0];

  if (name !== 'BodyProperties' || !attributes.version || !attributes.key) {
    throw Error('Invalid BodyProperties');
  }

  return attributes as BodyProperties;
}
