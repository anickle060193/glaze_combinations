import type { Glaze, GlazeData } from './glaze_types';

import glazesJsonUrl from '../data/glazes_data.json?url';

export async function fetchGlazesData()
{
  try
  {
    const response = await fetch( glazesJsonUrl );
    if( !response.ok )
    {
      throw new Error( `${response.status} - ${response.statusText}` );
    }
    const data: unknown = await response.json();
    return data as GlazeData;
  }
  catch( e )
  {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    throw new Error( `Failed to fetch glazes data: ${e}`, { cause: e } );
  }
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
