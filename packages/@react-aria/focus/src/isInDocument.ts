/**
 * A utility function that finds the element in DOM even if it's inside a Shadow DOM.
 * URL: https://terodox.tech/how-to-tell-if-an-element-is-in-the-dom-including-the-shadow-dom/ .
 */
export function isInDocument(element) {
  let currentElement = element;

  while (currentElement && currentElement.parentNode) {
    if (currentElement.parentNode === document) {
      return true;
    } else if (currentElement.parentNode instanceof DocumentFragment) {
      currentElement = currentElement.parentNode.host;
    } else {
      currentElement = currentElement.parentNode;
    }
  }

  return false;
}
