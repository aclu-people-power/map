import querystring from 'querystring';

/**
 * Get the hash params, parsed into an object.
 */
export function getHash() {
  return querystring.parse(window.location.hash.replace(/^#/, ''))
}

/**
 * Set hash query params with an object
 */
export function setHash(params = {}) {
  const existingParams = getHash();

  window.location.hash = querystring.stringify(Object.assign({},
    existingParams,
    params
  ));
}

let handleHashChange = null;

window.onhashchange = event => {
  if (handleHashChange) {
    handleHashChange(getHash());
  }
}

/**
 * Assign a listener on hash change -- it will receive the parsed
 * hash of event filters as its only arg.
 */
export function onHashChange(fn) {
  handleHashChange = fn;
}
