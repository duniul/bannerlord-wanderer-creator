import { Culture } from '../../types/culture';
import { createCulturesXlst } from './createCulturesXslt';

it('creates an XLST string for the given cultures', () => {
  const result = createCulturesXlst([
    { culture: Culture.Aserai, id: 'NPCCharacter.some_guy' },
    { culture: Culture.Battania, id: 'NPCCharacter.some_other_guy' },
  ]);

  expect(result).toMatchInlineSnapshot(`
    "<xsl:stylesheet version=\\"1.0\\" xmlns:xsl=\\"http://www.w3.org/1999/XSL/Transform\\">
      <xsl:output omit-xml-declaration=\\"yes\\"/>
      <xsl:template match=\\"@*|node()\\">
        <xsl:copy>
          <xsl:apply-templates select=\\"@*|node()\\"/>
        </xsl:copy>
      </xsl:template>
      <xsl:template match=\\"template[@name='NPCCharacter.spc_wanderer_aserai_0']\\">
        <!-- ASERAI -->
        <xsl:copy-of select=\\".\\"/>
        <template name=\\"NPCCharacter.some_guy\\"/>
      </xsl:template>
      <xsl:template match=\\"template[@name='NPCCharacter.spc_wanderer_battania_0']\\">
        <!-- BATTANIA -->
        <xsl:copy-of select=\\".\\"/>
        <template name=\\"NPCCharacter.some_other_guy\\"/>
      </xsl:template>
    </xsl:stylesheet>
    "
  `);
});
