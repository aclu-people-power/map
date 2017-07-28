import querystring from 'querystring';

import acluLogoFile from 'assets/images/logo-aclu.png';
import vrLogoFile from 'assets/images/logo-second-chances.png';

export default function parse() {
  // configure based on URL params (first hash, then querystring)
  let params = querystring.parse(window.location.hash.replace('#', ''));
  if (!params) {
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
      logoFile: vrLogoFile,
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
  if (params.source) {
    options.source = params.source;
  } else {
    options.source = 'map';
  }

  return options;
};
