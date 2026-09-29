/**
 * Listings shown on the site.
 *
 * FEATURED — Kelly's own active listing (her site's "Featured Properties" page
 * was empty when this was built). Facts and story copy come only from the MLS
 * remarks and the coldwellbanker.com listing record; photography is from the
 * listing's unbranded tour (see README › Image rights).
 *
 * MORE — active Coldwell Banker Elite listings shown on Kelly's site under
 * "My Company's Active Listings". They are credited to their listing agents,
 * as Bright MLS IDX rules require. Swap for Kelly's own listings as she gets them.
 */
import type { ImageMetadata } from 'astro';

import twilightAerial from '../assets/listings/serene-hills/00-twilight-aerial.jpg';
import frontPorch from '../assets/listings/serene-hills/07-front-porch.jpg';
import curvedStaircase from '../assets/listings/serene-hills/10-curved-staircase.jpg';
import diningRoom from '../assets/listings/serene-hills/12-dining-room.jpg';
import sunroom from '../assets/listings/serene-hills/17-sunroom.jpg';
import familyRoom from '../assets/listings/serene-hills/23-family-room.jpg';
import kitchenIsland from '../assets/listings/serene-hills/29-kitchen-island.jpg';
import primarySuite from '../assets/listings/serene-hills/37-primary-suite.jpg';
import soakingTub from '../assets/listings/serene-hills/44-soaking-tub.jpg';
import deck from '../assets/listings/serene-hills/63-deck.jpg';
import rearWalkout from '../assets/listings/serene-hills/68-rear-walkout.jpg';
import aerialCanopy from '../assets/listings/serene-hills/70-aerial-canopy.jpg';

import washingtonPorchView from '../assets/listings/washington-ave/porch-view-avenue.jpg';
import princeEdwardFront from '../assets/listings/prince-edward/front-spring.jpg';
import hanoverElevation from '../assets/listings/hanover-st/hanover-street-elevation.jpg';

export interface Photo {
  src: ImageMetadata;
  alt: string;
  caption?: string;
  /** CSS object-position for crops, e.g. '50% 60%' */
  focus?: string;
}

export interface Chapter {
  numeral: string;
  title: string;
  text: string;
  photos: Photo[];
  layout: 'porch' | 'rooms' | 'retreat' | 'land';
}

/** Typed helpers: full checking, without narrowing entries to literal types. */
const photo = (p: Photo) => p;
const photos = (p: Photo[]) => p;
const chapterList = (c: Chapter[]) => c;

const money = (n: number) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

export const featured = {
  slug: '37-serene-hills-dr',
  status: 'Active',
  street: '37 Serene Hills Drive',
  shortName: '37 Serene Hills',
  city: 'Fredericksburg',
  state: 'VA',
  zip: '22406',
  community: 'Tavern Gate Estates',
  county: 'Stafford County',
  price: money(875000),
  beds: 5,
  baths: 5,
  sqft: '5,690',
  acres: '3.29',
  yearBuilt: 2009,
  mls: 'VAST2052314',
  listedBy: 'Kelly M. Robertson, Coldwell Banker Elite',
  virtualTour: 'https://pearcepropertymedia.hd.pics/37-Serene-Hills-Dr/idx',
  cbListing:
    'https://www.coldwellbanker.com/va/fredericksburg/37-serene-hills-dr/lid-P00800000HEakQMnAbNaTbWA6kxIqu6jxuIY6Ga9',
  photographer: 'Pearce Property Media',

  hero: photo({
    src: twilightAerial,
    alt: 'Aerial view at dusk of a white two-story home with lit windows, set in a clearing of woods at the end of a curving driveway.',
    focus: '50% 58%',
  }),

  /** Homepage "chapter" paragraph — every clause traces to the MLS remarks. */
  story:
    'A Southern-style front porch sets the tone. Inside, a curved staircase rises through a two-story foyer, and the family room climbs two stories around a gas fireplace framed by private forest views. Upstairs, the primary suite opens beneath a cathedral ceiling; downstairs, a daylight walkout level with a fifth bedroom steps out to a fenced yard — and past it, private trails wind through 3.29 wooded acres in Tavern Gate.',

  /** Homepage gallery strip — three frames at deliberately different widths. */
  strip: photos([
    {
      src: curvedStaircase,
      alt: 'A curved wooden staircase rising through the two-story foyer.',
      caption: 'The foyer',
      focus: '52% 50%',
    },
    {
      src: familyRoom,
      alt: 'Two-story family room with a wall of arched windows above a gas fireplace.',
      caption: 'Family room',
      focus: '50% 45%',
    },
    {
      src: deck,
      alt: 'A wide back deck looking into the surrounding forest.',
      caption: 'The deck',
      focus: '40% 50%',
    },
  ]),

  chapters: chapterList([
    {
      numeral: 'I',
      title: 'Arrival',
      layout: 'porch',
      text: 'A classic Southern-style front porch — made for morning coffee and greeting guests — opens into a two-story foyer crowned by a curved staircase. A formal dining room connects to the kitchen through a butler’s pantry.',
      photos: [
        {
          src: frontPorch,
          alt: 'Straight-on view of the white house and its full-width front porch with columns and an American flag.',
          focus: '50% 62%',
        },
        {
          src: curvedStaircase,
          alt: 'A curved wooden staircase rising through the two-story foyer.',
          caption: 'The foyer',
        },
        {
          src: diningRoom,
          alt: 'Formal dining room with wainscoting, a chandelier and a window onto the trees.',
          caption: 'Dining room',
        },
      ],
    },
    {
      numeral: 'II',
      title: 'Gathering',
      layout: 'rooms',
      text: 'The family room rises two stories around a gas fireplace, with private forest views as its backdrop. The kitchen is built for company: dual ovens, a spacious island, a large pantry and a sunny breakfast area that opens to the back deck. Off the living room, a bright sunroom has its own private balcony.',
      photos: [
        {
          src: familyRoom,
          alt: 'Two-story family room with a wall of arched windows above a gas fireplace.',
          caption: 'Family room',
        },
        {
          src: kitchenIsland,
          alt: 'Kitchen with a granite-topped island, wood cabinetry and stainless appliances.',
          caption: 'Kitchen',
        },
        {
          src: sunroom,
          alt: 'Sunroom with a vaulted ceiling and a tall arched window onto the trees.',
          caption: 'Sunroom',
        },
      ],
    },
    {
      numeral: 'III',
      title: 'Retreat',
      layout: 'retreat',
      text: 'Upstairs, the primary suite opens beneath a soaring cathedral ceiling, with a private sitting area, dual walk-in closets and a spa-inspired bath with a soaking tub. Bedroom two has its own en-suite bath; bedrooms three and four share a hall bath.',
      photos: [
        {
          src: primarySuite,
          alt: 'Primary bedroom with a cathedral ceiling and windows onto the woods.',
          caption: 'Primary suite',
        },
        {
          src: soakingTub,
          alt: 'Soaking tub set beneath an arched window in the primary bath.',
          caption: 'Primary bath',
        },
      ],
    },
    {
      numeral: 'IV',
      title: 'The land',
      layout: 'land',
      text: 'The walkout lower level fills with light from full daylight windows and opens straight to the fenced backyard — with a fifth bedroom and full bath, it works as a guest suite. Beyond the yard, private trails wind around the property through 3.29 wooded acres.',
      photos: [
        {
          src: aerialCanopy,
          alt: 'High aerial view of unbroken forest canopy stretching to the horizon, with the house in a small clearing.',
          focus: '50% 55%',
        },
        {
          src: deck,
          alt: 'A wide back deck looking into the surrounding forest.',
          caption: 'The deck',
        },
        {
          src: rearWalkout,
          alt: 'The back of the house, showing the deck and the walkout lower level opening to the yard.',
          caption: 'Walkout lower level',
        },
      ],
    },
  ]),

  facts: [
    ['Price', money(875000)],
    ['Bedrooms', '5'],
    ['Bathrooms', '5'],
    ['Interior', '5,690 sq ft'],
    ['Lot', '3.29 acres'],
    ['Built', '2009'],
    ['Community', 'Tavern Gate Estates'],
    ['County', 'Stafford'],
    ['Schools', 'Stafford County Public Schools'],
    ['Garage', 'Attached, 3-car'],
    ['MLS #', 'VAST2052314'],
  ] as [string, string][],

  /** From the listing remarks. */
  gettingAround: [
    'Quick access to Route 610 (Garrisonville Road) and Route 17 (Warrenton Road)',
    'Nearby commuter lots with bus and slug-line service to D.C. and Northern Virginia',
    'Midway between Richmond and D.C., with access to Dulles, Reagan National and Richmond International',
  ],

  financingNote:
    'The listing notes an assumable VA loan, available to non-veterans as well. Buyers should consult a lender to confirm eligibility and current terms.',
};

export interface MoreListing {
  status: string;
  street: string;
  name?: string;
  city: string;
  zip: string;
  area: string;
  price: string;
  beds: number;
  baths: number;
  sqft: string;
  summary: string;
  listedBy: string;
  href: string;
  photo: Photo;
  /** 'photo' crops freely; 'mls' keeps the full frame (MLS watermark intact); 'drawing' is an architectural drawing */
  treatment: 'photo' | 'mls' | 'drawing';
}

export const moreListings: MoreListing[] = [
  {
    status: 'Active',
    street: '1304 Washington Avenue',
    city: 'Fredericksburg',
    zip: '22401',
    area: 'Washington Avenue',
    price: money(2500000),
    beds: 6,
    baths: 6,
    sqft: '10,500',
    summary:
      'Built in 1910 and rebuilt in 2001, a brick Colonial on 0.89 acres of the Avenue — with a hearth room whose floor-to-ceiling windows look out over downtown and the University of Mary Washington.',
    listedBy: 'Robin Marine, Coldwell Banker Elite; Magnolia Martin, Spotsylvania',
    href: 'https://kellyknowshomes.sites.cbmoxi.com/listing/VA/Fredericksburg/1304-Washington-Avenue-22401/218034554',
    photo: {
      src: washingtonPorchView,
      alt: 'The view from the columned front porch, down a brick walk to the tree-lined lawn of Washington Avenue.',
      focus: '50% 60%',
    },
    treatment: 'photo',
  },
  {
    status: 'Active',
    street: '1111 Prince Edward Street',
    city: 'Fredericksburg',
    zip: '22401',
    area: 'Historic District',
    price: money(2100000),
    beds: 5,
    baths: 7,
    sqft: '5,513',
    summary:
      'A corner lot in the Historic District, steps from the riverfront and the VRE — where the old detached garage has become an all-season pavilion with its own fireplace.',
    listedBy: 'Charlotte Rouse, Coldwell Banker Elite',
    href: 'https://kellyknowshomes.sites.cbmoxi.com/listing/VA/Fredericksburg/1111-Prince-Edward-Street-22401/224033370',
    photo: {
      src: princeEdwardFront,
      alt: 'A three-story brick house with dormers and a wide columned porch, framed by a flowering dogwood in spring.',
    },
    treatment: 'mls',
  },
  {
    status: 'Coming soon',
    name: 'The Rectory',
    street: '301 Hanover Street',
    city: 'Fredericksburg',
    zip: '22401',
    area: 'Downtown',
    price: money(2500000),
    beds: 3,
    baths: 4,
    sqft: '3,600',
    summary:
      'Four condominium residences are coming to the heart of downtown, pairing historic character with a full renovation — soaring 10-foot ceilings, gourmet kitchens, fireplaces and city views.',
    listedBy: 'Charlotte Rouse, Coldwell Banker Elite',
    href: 'https://kellyknowshomes.sites.cbmoxi.com/listing/VA/Fredericksburg/301-Hanover-Street-22401/233038999',
    photo: {
      src: hanoverElevation,
      alt: 'Architectural elevation drawing of the Hanover Street facade: a two-story building with a central double entrance, porches at each end and notes on the planned renovation.',
      caption: 'Hanover Street elevation, from the listing',
    },
    treatment: 'drawing',
  },
];

export const listingPath = (slug: string) => `/listing/${slug}/`;
