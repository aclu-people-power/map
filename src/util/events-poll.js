import loadScript from 'load-script';

export function loadEvents(cb = () => {}) {
  const script = document.getElementById('events-data');

  // Remove old script tag so we don't have like a million billion
  // of these in the DOM
  if (script && script.parentNode) {
    script.parentNode.removeChild(script);
  }

  loadScript(
    'https://s3.amazonaws.com/thirdbear-backups/aclu/public/action_events.js',
    { attrs: { id: 'events-data' } },
    cb
  )
}

export function pollForNewEvents(interval, cb = () => {}) {
  setInterval(() => {
    loadEvents(cb)
  }, interval);
}
