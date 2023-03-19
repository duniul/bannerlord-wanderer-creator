import { Wanderer } from '../../types/wanderers';
import { buildXml } from './xmlParser';

function groupIdsByCulture(wanderers: WandererCultureInfo[]) {
  const idsPerCulture: Record<string, string[]> = {};

  wanderers.forEach((wanderer) => {
    if (!idsPerCulture[wanderer.culture]) {
      idsPerCulture[wanderer.culture] = [];
    }

    idsPerCulture[wanderer.culture].push(wanderer.id);
  });

  return idsPerCulture;
}

export type WandererCultureInfo = Pick<Wanderer, 'id' | 'culture'>;

export function createCulturesXlst(wanderers: WandererCultureInfo[]): string {
  const idsPerCulture = groupIdsByCulture(wanderers);

  const jsXsltXml = {
    'xsl:stylesheet': {
      _attrs: { version: '1.0', 'xmlns:xsl': 'http://www.w3.org/1999/XSL/Transform' },
      'xsl:output': { _attrs: { 'omit-xml-declaration': 'yes' } },
      'xsl:template': [
        {
          _attrs: { match: '@*|node()' },
          'xsl:copy': { 'xsl:apply-templates': { _attrs: { select: '@*|node()' } } },
        },
        ...Object.entries(idsPerCulture)
          .sort(([ca], [cb]) => ca.localeCompare(cb))
          .map(([culture, ids]) => ({
            _attrs: { match: `template[@name='NPCCharacter.spc_wanderer_${culture}_0']` },
            _comment: ` ${culture.toUpperCase()} `,
            'xsl:copy-of': { _attrs: { select: '.' } },
            template: ids.map((id) => ({ _attrs: { name: `NPCCharacter.${id}` } })),
          })),
      ],
    },
  };

  return buildXml(jsXsltXml, { declaration: false });
}
