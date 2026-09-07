import type { SxProps } from '@mui/material';

type SxItem<T extends object> = Extract<SxProps<T>, readonly unknown[]>[ number ];

export function mergeSx<T extends object>( ...sxes: ( SxProps<T> | boolean | null | undefined )[] ): SxProps<T>
{
  const sxItems: SxItem<T>[] = [];

  for( const sx of sxes )
  {
    if( !sx )
    {
      continue;
    }

    if( Array.isArray( sx ) )
    {
      sxItems.push( ...sx as SxItem<T>[] );
    }
    else
    {
      sxItems.push( sx as SxItem<T> );
    }
  }

  return sxItems;
}
