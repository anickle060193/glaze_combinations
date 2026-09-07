import glazesJsonUrl from '../data/glazes_data.json?url';

export interface Glaze
{
  id: string;
  name: string;
  imageUrls: Record<string, string>;
}

export interface GlazeCombo
{
  id: string;
  glazeIds: string[];
  fireTemp: string;
  imageUrls: string[];
}

export interface GlazeData
{
  glazes: Glaze[];
  combos: GlazeCombo[];
  fireTemps: string[];
}

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
