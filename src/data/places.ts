/**
 * Place photography: homepage film, neighborhoods, local-life strip, About letterbox.
 *
 * Every image here is public domain or Creative Commons, credited on /credits
 * (see place-credits.json). Descriptions only claim what the source confirms.
 */
import type { Photo } from './listings';
import type { HeroCaption, HeroVideoSource } from '../components/Hero.astro';
import credits from './place-credits.json';

import heroPoster from '../assets/places/hero-poster.jpg';
import railroadBridge from '../assets/places/rappahannock-railroad-bridge.jpg';
import downtownStorefronts from '../assets/places/downtown-storefronts.jpg';
import chathamManor from '../assets/places/stafford-chatham-manor.jpg';
import lakeAnnaRoad from '../assets/places/spotsylvania-lake-anna-road.jpg';
import caledonTrail from '../assets/places/king-george-caledon-trail.jpg';
import goolricks from '../assets/places/life-goolricks-pharmacy.jpg';
import stGeorges from '../assets/places/life-st-georges-steeple.jpg';
import skylineSunset from '../assets/places/life-skyline-sunset-from-chatham.jpg';
import windowBox from '../assets/places/life-window-box-geraniums.jpg';
import risingSun from '../assets/places/life-rising-sun-tavern.jpg';
import chathamFlowers from '../assets/places/life-chatham-garden-flowers.jpg';

export interface Place {
  name: string;
  label: string;
  blurb: string;
  photo: Photo;
}

/**
 * Homepage film: public domain — National Park Service, Olmsted Center for Landscape
 * Preservation, "The Cultural Landscape at Chatham Manor" (2018). Live-action shots only,
 * no audio. See README › Image rights and /credits.
 */
export const hero: {
  poster: Photo;
  video: HeroVideoSource[] | null;
  nowShowing: string;
  captions: HeroCaption[];
} = {
  poster: {
    src: heroPoster,
    alt: 'Downtown Fredericksburg’s church steeples across the Rappahannock River, seen from the lawn at Chatham in late-afternoon light.',
    focus: '50% 50%',
  },
  // Phones get the lighter MP4; desktops get WebM (VP9) or, in Safari, the MP4.
  video: [
    { src: '/video/hero-720.mp4', type: 'video/mp4', media: '(max-width: 47.99rem)' },
    { src: '/video/hero.webm', type: 'video/webm' },
    { src: '/video/hero.mp4', type: 'video/mp4' },
  ],
  nowShowing: 'Fredericksburg, across the Rappahannock',
  // Shot changes in public/video/hero.mp4 (seconds)
  captions: [
    { from: 0, text: 'Fredericksburg, across the Rappahannock' },
    { from: 4.2, text: 'Chatham Manor, Stafford Heights' },
    { from: 8.7, text: 'The gardens at Chatham Manor' },
    { from: 13.9, text: 'Fredericksburg, across the Rappahannock' },
  ],
};

/** Draft place copy: geography and landmarks only — nothing claimed about Kelly. */
export const neighborhoods: Place[] = [
  {
    name: 'Downtown Fredericksburg',
    label: 'City of Fredericksburg',
    blurb: 'Brick sidewalks, eighteenth-century streets, and the river a block or two from Caroline Street.',
    photo: {
      src: downtownStorefronts,
      alt: 'Brick and painted rowhouse storefronts under street trees in Fredericksburg’s historic district.',
      focus: '28% 50%',
    },
  },
  {
    name: 'Stafford',
    label: 'Stafford County',
    blurb: 'Across the river from downtown — Chatham Heights, historic Falmouth, and wooded neighborhoods like Tavern Gate.',
    photo: {
      src: chathamManor,
      alt: 'The brick garden front of Chatham Manor on Stafford Heights, framed by trees on a sunny day.',
      focus: '50% 50%',
    },
  },
  {
    name: 'Spotsylvania',
    label: 'Spotsylvania County',
    blurb: 'Countryside to the south and west: the Spotsylvania Courthouse village, Civil War parkland, and the shores of Lake Anna.',
    photo: {
      src: lakeAnnaRoad,
      alt: 'A park road through autumn maples at Lake Anna State Park in Spotsylvania County.',
      focus: '50% 62%',
    },
  },
  {
    name: 'King George',
    label: 'King George County',
    blurb: 'Farmland and open water between the Rappahannock and the Potomac, from Caledon State Park to Dahlgren.',
    photo: {
      src: caledonTrail,
      alt: 'Two walkers on the leaf-covered Boyd’s Hole Trail at Caledon State Park in King George County.',
      focus: '50% 55%',
    },
  },
];

/** Stand-ins for Kelly's @lifeinfredericksburg posts (visibly marked as placeholders). */
export const localLife: (Photo & { ratio: 'square' | 'portrait' | 'tall' | 'landscape' })[] = [
  {
    src: goolricks,
    alt: 'Goolrick’s Pharmacy on a downtown Fredericksburg corner, with shoppers on the brick sidewalk.',
    ratio: 'square',
    focus: '72% 50%',
  },
  {
    src: stGeorges,
    alt: 'The steeple of St. George’s Episcopal Church against a blue evening sky.',
    ratio: 'tall',
    focus: '52% 40%',
  },
  {
    src: skylineSunset,
    alt: 'Sunset over Fredericksburg’s skyline and steeples, seen across the Rappahannock from the Chatham grounds.',
    ratio: 'landscape',
    focus: '65% 60%',
  },
  {
    src: windowBox,
    alt: 'Red geraniums spilling from a wrought-iron window box in downtown Fredericksburg.',
    ratio: 'portrait',
    focus: '50% 55%',
  },
  {
    src: risingSun,
    alt: 'The Rising Sun Tavern, an eighteenth-century clapboard house with a long front porch and an American flag.',
    ratio: 'square',
    focus: '38% 55%',
  },
  {
    src: chathamFlowers,
    alt: 'Pink and orange blooms in the Chatham gardens in fall.',
    ratio: 'portrait',
    focus: '60% 60%',
  },
];

export const aboutRiver: Photo & { caption: string } = {
  src: railroadBridge,
  alt: 'Early light on the Rappahannock at Fredericksburg: the stone-arch railroad bridge and its reflection in still water, with a train crossing.',
  caption: 'The Rappahannock at Fredericksburg',
  focus: '50% 42%',
};

export interface Credit {
  file: string;
  title: string;
  author: string;
  license: string;
  licenseUrl: string;
  sourceUrl: string;
  note?: string;
}

export const placeCredits: Credit[] = credits;
