import fs from 'node:fs/promises';

import { PARSED_GLAZES_DATA_FILENAME, RAW_GLAZES_DATA_FILENAME, type RawGlazeDataCombo } from './common.ts';

import type { Glaze, GlazeCombo, GlazeData } from '../src/utilities/glazes.ts';
import path from 'node:path';

const rawCombosContent = await fs.readFile( RAW_GLAZES_DATA_FILENAME, { encoding: 'utf-8' } );
const rawCombos = JSON.parse( rawCombosContent ) as RawGlazeDataCombo[];

const glazeMapping: Record<string, Glaze> = {};
const comboMapping: Record<string, GlazeCombo> = {};
const fireTemps = new Set<string>();

for( const { label, fireTemp, comboImageUrl, glazeImageUrls } of rawCombos )
{
  fireTemps.add( fireTemp );

  const match = /^(.*?) over (.*?)(?: on (.*?))?$/i.exec( label );
  if( !match )
  {
    console.warn( 'Unexpected glaze label format:', label );
    continue;
  }

  const glazes = match.slice( 1 ).filter( ( s ) => !!s );

  if( glazes.length !== glazeImageUrls.length )
  {
    console.log( 'Glaze name/image count mismatch:', glazes, '!=', glazeImageUrls );
    continue;
  }

  let valid = true;
  const comboGlazeIds: string[] = [];

  for( let i = 0; i < glazes.length; i++ )
  {
    const glazeName = glazes[ i ];
    const glazeImageUrl = glazeImageUrls[ i ];

    const nameMatch = /^([a-z]+?)-?(\d+)/i.exec( glazeName );
    if( !nameMatch )
    {
      console.warn( 'Unexpected glaze name format:', glazeName );
      valid = false;
      continue;
    }
    const glazeId = nameMatch[ 1 ].toLowerCase() + '-' + nameMatch[ 2 ].padStart( 3, '0' );

    const urlMatch = /\/([a-z]+?)-?(\d+)(?:[-_]\w+)*\.jpg$/i.exec( glazeImageUrl );
    if( !urlMatch )
    {
      console.warn( 'Unexpected glaze image URL format:', glazeImageUrl );
      valid = false;
      continue;
    }
    const urlGlazeId = urlMatch[ 1 ].toLowerCase() + '-' + urlMatch[ 2 ].padStart( 3, '0' );

    if( glazeId !== urlGlazeId )
    {
      console.warn( 'Glaze image URL does not match glaze:', glazeName, '!=', glazeImageUrl, ',', glazeId, '!=', urlGlazeId );
      valid = false;
      continue;
    }

    const glaze = glazeMapping[ glazeId ] ??= {
      id: glazeId,
      name: glazeName,
      imageUrls: {},
    };
    glaze.imageUrls[ fireTemp ] = glazeImageUrl;

    comboGlazeIds.push( glazeId );
  }

  if( valid )
  {
    const comboId = fireTemp.toLowerCase().replace( /\s+/g, '' ) + ' ' + comboGlazeIds.join( '/' );
    const combo = comboMapping[ comboId ] ??= {
      id: comboId,
      fireTemp,
      glazeIds: comboGlazeIds,
      imageUrls: [],
    };
    combo.imageUrls.push( comboImageUrl );
  }
}

const sortedGlazes = Object.values( glazeMapping )
  .sort( ( a, b ) => a.id.localeCompare( b.id, undefined, { numeric: true, usage: 'sort' } ) );

const sortedCombos = Object.entries( comboMapping )
  .sort( ( [ a ], [ b ] ) => a.localeCompare( b, undefined, { numeric: true, usage: 'sort' } ) )
  .map( ( [ , c ] ) => c );

const sortedFireTemps = Array.from( fireTemps )
  .sort( ( a, b ) => a.localeCompare( b, undefined, { numeric: true, usage: 'sort' } ) );

const parsedGlazeData: GlazeData = {
  glazes: sortedGlazes,
  combos: sortedCombos,
  fireTemps: sortedFireTemps,
};
await fs.mkdir( path.dirname( PARSED_GLAZES_DATA_FILENAME ), { recursive: true } );
await fs.writeFile( PARSED_GLAZES_DATA_FILENAME, JSON.stringify( parsedGlazeData, null, 2 ) );

console.log( 'Parsed', parsedGlazeData.glazes.length, 'glazes and', parsedGlazeData.combos.length, 'combos' );
