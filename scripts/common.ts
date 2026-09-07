import path from 'node:path';

export interface RawGlazeDataCombo
{
  label: string;
  fireTemp: string;
  comboImageUrl: string;
  glazeImageUrls: string[];
}

export const MAYCO_GLAZE_COMBINATIONS_URL = 'https://www.maycocolors.com/glaze-combinations/?_per_page=-1';

export const RAW_GLAZES_DATA_FILENAME = path.join( import.meta.dirname, 'raw_glazes_data.json' );
export const PARSED_GLAZES_DATA_FILENAME = path.join( import.meta.dirname, '..', 'src', 'data', 'glazes_data.json' );
