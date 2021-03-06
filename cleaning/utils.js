import {XmlEntities} from "https://deno.land/x/html_entities@v1.0/mod.js";
import {cinderellaImages} from './cinderella.js';

export function getWeek() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  // Thursday in current week decides the year.
  date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
  // January 4 is always in week 1.
  const week1 = new Date(date.getFullYear(), 0, 4);
  // Adjust to Thursday in week 1 and count number of weeks from date to week1.
  return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000
           - 3 + (week1.getDay() + 6) % 7) / 7);
}


export function randomCinderella() {
    return cinderellaImages[Math.floor(Math.random() * cinderellaImages.length)];
}


export function sanitize(s) {
    return XmlEntities.encodeNonUTF(s)
};
