import { buildXml, parseXml } from './xmlParser';

export function parseSubModuleXml(xml: string) {
  const jsXml = parseXml(xml);

  return {
    name: jsXml.Module?.Name?._attrs.value,
    version: jsXml.Module?.Version?._attrs.value.replace('v', ''),
  };
}

function stripExt(modulePath: string) {
  return modulePath.replace(/(\.xml|\.xslt)$/g, '');
}

export type SubModuleXmlProps = {
  name: string;
  id: string;
  version: string;
  modulePaths: {
    cultures: string;
    characters: string;
    strings: string;
  };
};

export function createSubModuleXml({ name, id, version, modulePaths }: SubModuleXmlProps) {
  const jsXml = {
    Module: {
      Name: { _attrs: { value: name } },
      Id: { _attrs: { value: id } },
      Version: { _attrs: { value: `v${version}` } },
      SingleplayerModule: { _attrs: { value: 'true' } },
      MultiplayerModule: { _attrs: { value: 'false' } },
      Official: { _attrs: { value: 'false' } },
      Xmls: {
        XmlNode: [
          // CULTURES
          {
            XmlName: { _attrs: { id: 'SPCultures', path: stripExt(modulePaths.cultures) } },
            IncludedGameTypes: {
              GameType: [
                { _attrs: { value: 'Campaign' } },
                { _attrs: { value: 'CampaignStoryMode' } },
                { _attrs: { value: 'CustomGame' } },
                { _attrs: { value: 'EditorGame' } },
              ],
            },
          },
          // CHARACTERS
          {
            XmlName: { _attrs: { id: 'NPCCharacters', path: stripExt(modulePaths.characters) } },
            IncludedGameTypes: {
              GameType: [{ _attrs: { value: 'Campaign' } }, { _attrs: { value: 'CampaignStoryMode' } }],
            },
          },
          // DIALOGUE AND TRANSLATIONS
          {
            XmlName: { _attrs: { id: 'GameText', path: stripExt(modulePaths.strings) } },
          },
        ],
      },
    },
  };

  return buildXml(jsXml, { declaration: true });
}
