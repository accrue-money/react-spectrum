/**
 * A utility function that finds the activeElement in DOM.
 * Takes shadowdom into consideration.
 */
export function getActiveElement() {
  let activeElement = document.activeElement;
  while (activeElement && activeElement.shadowRoot && activeElement.shadowRoot.activeElement) {
    activeElement = activeElement.shadowRoot.activeElement;
  }
  return activeElement;
}
