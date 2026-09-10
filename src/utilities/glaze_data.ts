import type { Glaze, GlazeCombo, GlazeData, GlazeOrder } from './glaze_types';

import glazesJsonUrl from '../data/glazes_data.json?url';

export async function fetchGlazesData()
{
  const response = await fetch( glazesJsonUrl );
  if( !response.ok )
  {
    throw new Error( `${response.status} - ${response.statusText}` );
  }
  const data: unknown = await response.json();

  return data as GlazeData;
}

const PREFERRED_FIRE_TEMPS: string[] = [ '06', '6', '10' ];

export function getGlazeImageUrl( glaze: Glaze, fireTemps?: string[] ): string
{
  let preferredImageUrl: string | null = null;

  for( const fireTemp of PREFERRED_FIRE_TEMPS )
  {
    const imageUrl = glaze.imageUrls[ fireTemp ];
    if( imageUrl )
    {
      if( fireTemps?.includes( fireTemp ) )
      {
        return imageUrl;
      }

      preferredImageUrl ??= imageUrl;
    }
  }

  return preferredImageUrl ?? Object.values<string | undefined>( glaze.imageUrls )[ 0 ] ?? '';
}

const GLAZE_ID_COLLATOR = new Intl.Collator( undefined, {
  sensitivity: 'accent',
  numeric: true,
  ignorePunctuation: true,
  usage: 'sort',
} );

export function compareGlazeCombos( a: GlazeCombo, b: GlazeCombo, order: GlazeOrder ): number
{
  const aGlazeIds = a.glazeIds.slice();
  const bGlazeIds = b.glazeIds.slice();

  if( order === 'under' )
  {
    aGlazeIds.reverse();
    bGlazeIds.reverse();
  }

  const length = Math.min( aGlazeIds.length, bGlazeIds.length );
  for( let i = 0; i < length; i++ )
  {
    const cmp = GLAZE_ID_COLLATOR.compare( aGlazeIds[ i ], bGlazeIds[ i ] );
    if( cmp !== 0 )
    {
      return cmp;
    }
  }

  return aGlazeIds.length - bGlazeIds.length;
}
