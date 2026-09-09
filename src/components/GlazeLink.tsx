import React from 'react';
import type { SxProps, Theme } from '@mui/material';

import { ExternalLink } from './ExternalLink';

import type { Glaze } from '../utilities/glaze_types';

interface Props
{
  glaze: Glaze;
  sx?: SxProps<Theme>;
  children?: NonNullable<React.ReactNode>;
}

export const GlazeLink: React.FC<Props> = ( { glaze, sx, children } ) =>
{
  return (
    <ExternalLink
      sx={sx}
      href={`https://www.maycocolors.com/product/${glaze.id}/`}
    >
      {children ?? glaze.name}
    </ExternalLink>
  );
};
