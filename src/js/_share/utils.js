/**
 * Helper function to create a new element with the given attributes and children
 */
export function newElement(name, attributes, children) {
  const e = document.createElement(name);
  // for (const key in attributes) {
  Object.keys(attributes).forEach((key) => {
    if (key === 'content') {
      e.appendChild(document.createTextNode(attributes[key]));
    } else {
      e.setAttribute(key.replace(/_/g, '-'), attributes[key]);
    }
  });
  (children || []).forEach((child) => {
    e.appendChild(child);
  });
  return e;
}

/**
 * Extract correct plural form for a translated string.
 * For insight for the plural rules see:
 * https://developer.mozilla.org/en-US/docs/Mozilla/Localization/Localization_and_Plurals#List_of_Plural_Rules
 */
export function getPluralForm(pluralCount = 1, translatedString = '') {
  const count = parseInt(pluralCount, 10);
  const pluralRule = parseInt(browser.i18n.getMessage('pluralRule'), 10);
  const pluralForms = translatedString.split('|');

  if (pluralForms.length === 1) {
    return translatedString;
  }

  switch (pluralRule) {
    /*
     * Rule #0 [everything]
     */
    case 0:
      return pluralForms[0];
    /*
     * Rule #1 [is 1]|[everything else]
     */
    case 1:
      if (count === 1) {
        return pluralForms[0];
      }
      return pluralForms[1];
    /*
     * Rule #2 [0 or 1]|[everything else]
     */
    case 2:
      if (count < 2) {
        return pluralForms[0];
      }
      return pluralForms[1];
    /*
     * Rule #7 [is 1, excluding 11]|[2-4, excluding 12-14]|[everything else]
     */
    case 7:
      if (count % 10 === 1 && count % 100 !== 11) {
        return pluralForms[0];
      } if (count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 10 || count % 100 > 20)) {
        return pluralForms[1];
      }
      return pluralForms[2];
    /*
     * Rule #9 [is 1]|[2-4, excluding 12-14]|[everything else]
     */
    case 9:
      if (count === 1) {
        return pluralForms[0];
      } if (count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 10 || count % 100 > 20)) {
        return pluralForms[1];
      }
      return pluralForms[2];
    default:
      return translatedString;
  }
}

export function formatByteSize(bytes) {
  if (bytes < 1024) return `${bytes} bytes`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(3)} KiB`;
  if (bytes < 1073741824) return `${(bytes / 1048576).toFixed(3)} MiB`;
  return `${(bytes / 1073741824).toFixed(3)} GiB`;
}
