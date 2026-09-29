/**
 * Agent, brokerage and compliance details.
 *
 * Sources (checked Sept 2026):
 *  - kellyknowshomes.sites.cbmoxi.com (home + /profile/my-bio)
 *  - coldwellbanker.com agent profile for Kelly Robertson
 *  - coldwellbanker.com office record for Coldwell Banker Elite, 520 William St
 *
 * Nothing here is invented. Anything we could not confirm is a visible
 * [BRACKETED PLACEHOLDER] and is listed in README.md.
 */

export const agent = {
  name: 'Kelly Robertson',
  legalName: 'Kelly M. Robertson',
  title: 'Real Estate Salesperson',
  designation: 'Military Relocation Professional (MRP)',
  since: 2005,
  licenseNumber: '0225231616',
  licenseLabel: 'Virginia Real Estate License #0225231616',
  direct: { display: '(703) 244-2420', href: 'tel:+17032442420' },
  email: 'krobertson@coldwellbankerelite.com',
  facebook: { href: 'https://www.facebook.com/KellyKnowsHomes', label: 'Facebook' },
  instagram: {
    href: 'https://www.instagram.com/lifeinfredericksburg',
    handle: '@lifeinfredericksburg',
    label: 'Instagram',
  },
} as const;

export const brokerage = {
  name: 'Coldwell Banker Elite',
  office: 'Downtown Fredericksburg',
  street: '520 William Street',
  city: 'Fredericksburg',
  state: 'VA',
  zip: '22401',
  // CB's official office record and Kelly's bio page list (540) 373-0100.
  // Her current site header shows (540) 373-1000 — confirm with Kelly (README).
  phone: { display: '(540) 373-0100', href: 'tel:+15403730100' },
} as const;

/** Links back to Kelly's existing Coldwell Banker (Moxi) site. */
export const cbSite = {
  home: 'https://kellyknowshomes.sites.cbmoxi.com/',
  search: 'https://kellyknowshomes.sites.cbmoxi.com/search/#!/defaultsearch:true',
  fairHousing: 'https://kellyknowshomes.sites.cbmoxi.com/fair-housing-notice/',
  privacy: 'https://kellyknowshomes.sites.cbmoxi.com/privacy-policy',
  terms: 'https://kellyknowshomes.sites.cbmoxi.com/terms-of-use',
  accessibility: 'https://kellyknowshomes.sites.cbmoxi.com/accessibility-statement/',
  profile:
    'https://www.coldwellbanker.com/va/fredericksburg/agents/kelly-robertson/aid-P00200000GMEsmxxVVPYVZoswc0t3kJKVOJtwkpm',
} as const;

/** Standard Coldwell Banker disclaimer, as shown on Kelly's current site. */
export const cbDisclaimer =
  'Coldwell Banker and the Coldwell Banker logo are trademarks of Coldwell Banker Real Estate LLC. The Coldwell Banker® System is comprised of company owned offices which are owned by a subsidiary of Anywhere Advisors LLC and franchised offices which are independently owned and operated. The Coldwell Banker System fully supports the principles of the Fair Housing Act and the Equal Opportunity Act.';

export const equalHousingStatement =
  'We are pledged to the letter and spirit of U.S. policy for the achievement of equal housing opportunity throughout the Nation. We encourage and support an affirmative advertising and marketing program in which there are no barriers to obtaining housing because of race, color, religion, sex, handicap, familial status, or national origin.';

export const idxDisclaimer =
  'Listing information is deemed reliable but is not guaranteed. Listing data courtesy of Bright MLS IDX; listings shown are marketed by the listing brokerage credited with each one.';
