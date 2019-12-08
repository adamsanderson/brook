/**
 * Tests for the presence of HTML entities
 * For instance &amp; or &#8217;
 */
const ENTITY_REGEXP = /&#?[a-zA-Z0-9]+;/

// Cache a textarea element for decoding.
let element

export default function decodeHtmlEntities(text) {
    if (!ENTITY_REGEXP.test(text)) return text

    element = element || document.createElement("textarea")
    element.innerHTML = text
    return element.value
}