import convert, { Element } from 'xml-js';

export function parseSubModuleXml(xml: string) {
  const jsonifiedXml = convert.xml2js(xml);

  const nameElement = jsonifiedXml?.elements?.[0]?.elements?.find((el: Element) => el.name === 'Name');
  const versionElement = jsonifiedXml?.elements?.[0]?.elements?.find((el: Element) => el.name === 'Version');

  return {
    name: nameElement?.attributes.value,
    version: versionElement?.attributes?.value?.replace('v', ''),
  };
}

export function createSubModuleXml(name: string, id: string, version: string, charactersPath: string) {
  return `<?xml version="1.0" encoding="utf-8"?>
<Module>
  <Name value="${name}" />
  <Id value="${id}" />
  <Version value="v${version}" />
  <SingleplayerModule value="true" />
  <MultiplayerModule value="false" />
  <Official value="false" />
  <DependedModules>
    <DependedModule Id="Native" />
    <DependedModule Id="SandBoxCore" />
    <DependedModule Id="Sandbox" />
    <DependedModule Id="CustomBattle" />
    <DependedModule Id="StoryMode" />
  </DependedModules>
  <SubModules>
    <SubModule>
      <Name value="WandererStringsLoader"/>
      <DLLName value="WandererStringsLoader.dll"/>
      <SubModuleClassType value="WandererStringsLoader.Main"/>
      <Tags>
        <Tag key="DedicatedServerType" value="none" />
        <Tag key="IsNoRenderModeElement" value="false" />
      </Tags>
    </SubModule>
  </SubModules>
  <Xmls>
    <XmlNode>
      <XmlName id="NPCCharacters" path="${charactersPath.replace(/.*\/([\w]*).xml$/, '$1')}" />
      <IncludedGameTypes>
        <GameType value="Campaign" />
        <GameType value="CampaignStoryMode" />
      </IncludedGameTypes>
    </XmlNode>
  </Xmls>
</Module>`;
}
