import { createSubModuleXml } from './subModuleXml';

it('creates an SubModule.xml string for the given props', () => {
  const result = createSubModuleXml({
    id: 'zzMyTestMod',
    name: 'My Test Mod',
    version: '1.0.0',
    modulePaths: {
      cultures: 'spcultures_zzmytestmod.xslt',
      characters: 'npccharacters_zzmytestmod.xml',
      strings: 'gametext_zzmytestmod.xml',
    },
  });

  expect(result).toMatchInlineSnapshot(`
    "<?xml version=\\"1.0\\" encoding=\\"utf-8\\"?>
    <Module>
      <Name value=\\"My Test Mod\\"/>
      <Id value=\\"zzMyTestMod\\"/>
      <Version value=\\"v1.0.0\\"/>
      <SingleplayerModule value=\\"true\\"/>
      <MultiplayerModule value=\\"false\\"/>
      <Official value=\\"false\\"/>
      <Xmls>
        <XmlNode>
          <XmlName id=\\"SPCultures\\" path=\\"spcultures_zzmytestmod\\"/>
          <IncludedGameTypes>
            <GameType value=\\"Campaign\\"/>
            <GameType value=\\"CampaignStoryMode\\"/>
            <GameType value=\\"CustomGame\\"/>
            <GameType value=\\"EditorGame\\"/>
          </IncludedGameTypes>
        </XmlNode>
        <XmlNode>
          <XmlName id=\\"NPCCharacters\\" path=\\"npccharacters_zzmytestmod\\"/>
          <IncludedGameTypes>
            <GameType value=\\"Campaign\\"/>
            <GameType value=\\"CampaignStoryMode\\"/>
          </IncludedGameTypes>
        </XmlNode>
        <XmlNode>
          <XmlName id=\\"GameText\\" path=\\"gametext_zzmytestmod\\"/>
        </XmlNode>
      </Xmls>
    </Module>
    "
  `);
});
