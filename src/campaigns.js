import querystring from 'querystring';

import acluLogoFile from 'assets/images/logo-aclu.png';

export default function parse() {
  // configure based on URL params (first hash, then querystring)
  let params = querystring.parse(window.location.hash.replace('#', ''));

  if (!Object.keys(params).length) {
    params = querystring.parse(window.location.search.replace('?', ''));
  }

  // match campaign name on #c= or #campaign=
  let campaignName = params.c || params.campaign || '';
  // make case insensitive by matching on lowercase
  campaignName = campaignName.toLowerCase();

  let campaigns = {
    'default': {
      logoFile: acluLogoFile,
      hostEventLink: 'https://go.peoplepower.org/signup/host_new/',
      showACLU: true,
      filters: {},
    },
    'votingrights': {
      logoFile: acluLogoFile,
      hostEventLink: 'https://go.peoplepower.org/event/voting_rights/create/',
      showACLU: false,
      filters: {
        'us_state': 'FL',
        'eventType': 'votingRights'
      },
    }
  };
  campaigns['vr'] = campaigns['votingrights']; // add shorter alias

  let options = campaigns[campaignName] || campaigns['default'];

  // replace source parameter, if available
  options.source = params.source || 'map';
  options.akid = params.akid || '';

  return options;
};
