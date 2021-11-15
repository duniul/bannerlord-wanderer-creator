import { parseXmlToJs } from './xmlParser';

export function parseSubModuleXml(xml: string) {
  const jsXml = parseXmlToJs(xml);

  return {
    name: jsXml.Module?.Name?._attrs.value,
    version: jsXml.Module?.Version?._attrs.value.replace('v', ''),
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
      <SubModuleClassType value="WandererStringsLoader.SubModule"/>
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
