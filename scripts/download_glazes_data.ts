import fs from 'node:fs/promises';

import { JSDOM } from 'jsdom';

import { MAYCO_GLAZE_COMBINATIONS_URL, RAW_GLAZES_DATA_FILENAME, type RawGlazeDataCombo } from './common.ts';

console.log( 'Fetching Mayco glaze combinations...' );
const response = await fetch( MAYCO_GLAZE_COMBINATIONS_URL );
if( !response.ok )
{
  throw new Error( `${response.status} - ${response.statusText}` );
}

const htmlText = await response.text();

const { window: { document: doc } } = new JSDOM( htmlText, {
  url: MAYCO_GLAZE_COMBINATIONS_URL,
} );

const combos: RawGlazeDataCombo[] = [];

for( const combo of doc.querySelectorAll( '.combo' ) )
{
  const label = combo.querySelector( '.combo-bottom' )?.textContent.trim().replace( /\s+/g, ' ' );
  const fireTemp = combo.querySelector( '.fire-temp-tag' )?.textContent.trim();
  const comboImageUrl = combo.querySelector( '.combo-top .thumb-wrap a img' )?.getAttribute( 'src' );
  if( !label || !fireTemp || !comboImageUrl )
  {
    continue;
  }

  const glazeImageUrls = Array.from( combo.querySelectorAll( '.ou-images a' ) )
    .map( ( elem ) => elem.getAttribute( 'href' ) )
    .filter( ( u ) => typeof u === 'string' );

  combos.push( {
    label,
    fireTemp,
    comboImageUrl,
    glazeImageUrls,
  } );
}

console.log( 'Found', combos.length, 'glaze combos' );

await fs.writeFile( RAW_GLAZES_DATA_FILENAME, JSON.stringify( combos, null, 2 ), { encoding: 'utf-8' } );
