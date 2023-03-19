const translationIdRegex = /\s*{[^}]*}\s*/g; // Example: "{=whvMZZba}Guarded Padded Vambraces" -> "{=whvMZZba}"
const pluralRegex = /\{@Plural\}[^{]+\{\\@\}/g; // Example: "Cossian{@Plural}Cossian horses{@/}" -> "{@Plural}Cossian horses{@/}"

function stripTranslationId(name) {
  return name.replace(translationIdRegex, '').replace(pluralRegex, '');
}

module.exports = {
  stripTranslationId,
};
