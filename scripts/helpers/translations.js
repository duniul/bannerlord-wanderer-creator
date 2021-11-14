const translationIdRegex = /\s*{[^}]*}\s*/;

// Example name with translation ID: "{=whvMZZba}Guarded Padded Vambraces"
function stripTranslationId(name) {
  return name.replace(translationIdRegex, '');
}

module.exports = {
  stripTranslationId,
};
